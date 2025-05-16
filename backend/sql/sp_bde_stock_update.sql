USE [Zimmer_Prod]
GO
/****** Object:  StoredProcedure [dbo].[sp_bde_stock_update]    Script Date: 03.12.2024 16:57:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_bde_stock_update]
	@tenant_id INT,								-- 1 Standard
	@operation_type INT,						-- 2 Abbuchung, 4 Rückbuchung, 3 Inventur, 7 Verschrottung
    @operation_description VARCHAR(100),		-- 'BDE Operation'
    @stock_id INT,								-- 1 Standard
    @stock_location_id INT,						-- 3 Standard
    @user_id INT,								-- 2345 Sickl Martin
    @item_id VARCHAR(8),						-- A123456
	@item_serial_number VARCHAR(100),			-- ''
    @item_quantity NUMERIC(16,3),				-- 1
	@order_id VARCHAR(6)						-- '14Z24'
AS
BEGIN
	SET NOCOUNT ON;

	IF @item_quantity = 0
	BEGIN
        THROW 50001, 'Error: Item count must be greater than 0.', 1;
	END

    IF @item_serial_number IS NOT NULL AND @item_quantity > 1
    BEGIN
		THROW 50002, 'Error: When an item serial number is provided, item count must not exceed 1.', 1;
    END
	
	DECLARE @item_type AS VARCHAR(1)
	SET @item_type = LEFT(@item_id, 1)

	IF @item_type = 'A'
	BEGIN
		DECLARE @date as DATETIME
		SET @date = GETDATE()

		-- get variables
		SET @item_id = RIGHT(@item_id, LEN(@item_id) - 1)

		DECLARE @current_inventory AS NUMERIC(16,3)
		DECLARE @new_inventory AS NUMERIC(16,3)
		SELECT TOP 1 @current_inventory = L.[BESTAND] FROM LAGB AS L WHERE L.MANDANT = @tenant_id AND L.[TYP] = @item_type AND L.[KEY] = @item_id ORDER BY L.[SYSID] DESC

		DECLARE @order_internal_id AS INT
		SELECT @order_internal_id = COALESCE((SELECT V.[VORGANG] FROM VORGANG AS V WHERE V.MANDANT = @tenant_id AND V.[VORGNR] = UPPER(@order_id) AND V.[VORGART] = 2), 0)

		DECLARE @username AS VARCHAR(100)
		SET @username = (SELECT U.[USER] FROM USER1 AS U WHERE U.MANDANT = @tenant_id AND U.[PERSNR] = @user_id)

		IF @operation_type = 2
		BEGIN
			-- Abbuchung
			SET @new_inventory = @current_inventory - @item_quantity
			IF @order_internal_id = 0
			BEGIN
				THROW 50006, 'Error orderid is not present.', 1;
			END;

			-- Reservierung Abbuchen
			DECLARE @reservation_internal_id AS INT = 0
			DECLARE @reservation_quantity AS NUMERIC(16,3) 
			DECLARE @log_new_reservation_quantity AS NUMERIC(16,3) = 0
			SELECT	
				@reservation_internal_id = COALESCE(R.[SYSID], 0), 
				@reservation_quantity = R.[MENGE] 
				FROM RESERVIERT AS R WHERE 
					R.VORGANG = @order_internal_id and 
					R.[KEY] = @item_id and 
					R.[TYP] = @item_type and 
					R.[LNR] = @stock_id and 
					R.[LORT] = @stock_location_id and 
					R.[MANDANT] = @tenant_id

			IF @reservation_internal_id != 0
			BEGIN 
				IF @item_quantity >= @reservation_quantity
				BEGIN
					DELETE FROM RESERVIERT WHERE [SYSID] = @reservation_internal_id

					IF (@reservation_quantity - @item_quantity) <= 0
					BEGIN
						SET @log_new_reservation_quantity = @reservation_quantity
					END
					ELSE
					BEGIN
						SET @log_new_reservation_quantity = @item_quantity
					END
				END
				ELSE IF @item_quantity < @reservation_quantity
				BEGIN
					SET @log_new_reservation_quantity = @item_quantity
					UPDATE RESERVIERT SET MENGE = @reservation_quantity - @item_quantity WHERE [SYSID] = @reservation_internal_id
				END
			END

			-- Reservierungsportokoll
			INSERT INTO RESPROT
				(
					[MANDANT],
					[LNR],
					[LORT],
					[TYP],
					[KEY],
					[FORMAT],
					[VORGANG],
					[VORGPOS],
					[DATUM],
					[ZEIT],
					[LFD],
					[V_VORGANG],
					[MENGE],
					[FORMATSTK],
					[ERFASSER],
					[MATANF]
				) VALUES (
					@tenant_id,									--[MANDANT]
					@stock_id,									--[LNR]
					@stock_location_id,							--[LORT]
					@item_type,									--[TYP]
					@item_id,									--[KEY]
					0,											--[FORMAT]
					@order_internal_id,							--[VORGANG]
					0,											--[VORGPOS]
					@date,										--[DATUM]
					FORMAT(@date, 'HHmmss'),					--[ZEIT]
					1,											--[LFD]
					0,											--[V_VORGANG]
					-@log_new_reservation_quantity,				--[MENGE]
					0,											--[FORMATSTK]
					@username,									--[ERFASSER]
					0											--[MATANF]
				)

		END
		ELSE IF @operation_type = 4
		BEGIN
			-- Rückbuchung
			SET @new_inventory = @current_inventory + @item_quantity
			IF @order_internal_id = 0
			BEGIN
				THROW 50007, 'Error orderid is not present.', 1;
			END;
		END
		ELSE IF @operation_type = 3
		BEGIN
			DECLARE @is_stock_delta AS INT
			IF @current_inventory > @item_quantity
			BEGIN
				SET @is_stock_delta = 2
			END
			ELSE IF @current_inventory < @item_quantity
			BEGIN
				SET @is_stock_delta = 1
			END
			ELSE
			BEGIN
				SET @is_stock_delta = 0
			END;
			-- Inventur
			INSERT INTO INVDIFF
				(
					[MANDANT], 
					[LAGER], 
					[LORT], 
					[TYP], 
					[KEY], 
					[DATUM], 
					[LFD], 
					[STANDALT], 
					[STANDNEU], 
					[ISDIFF]
				) VALUES (
					@tenant_id,						-- [MANDANT]
					@stock_id,						-- [LAGER]
					@stock_location_id,				-- [LORT]
					@item_type,						-- [TYP]
					@item_id,						-- [KEY]
					@date,							-- [DATUM]
					1,								-- [LFD]
					@current_inventory,				-- [STANDALT]
					@item_quantity,					-- [STANDNEU] 
					@is_stock_delta					-- [ISDIFF]
				)

			-- Prepare Values for LAGB
			SET @new_inventory = @item_quantity
			SET @order_internal_id = 0
		END
		ELSE IF @operation_type = 7
		BEGIN
			-- Verschrottung
			SET @new_inventory = @current_inventory - @item_quantity
			SET @order_internal_id = 0
		END
		ELSE
		BEGIN
			-- Error Message
			THROW 50004, 'Operation Type is not recognized. Please use 2, 4, 3 or 7', 1;
		END

		BEGIN
			INSERT INTO LAGB
				(
					[MANDANT], 
					[LNR], 
					[LORT], 
					[TYP], 
					[KEY], 
					[DATUM], 
					[ZEIT], 
					[LFD], 
					[ERFASSER], 
					[BA], 
					[MENGE], 
					[V_AUFTRAG], 
					[V_AUFT], 
					[V_AUFTPOS], 
					[V_VORGANG], 
					[V_VORGPOS], 
					[FORMAT], 
					[FORMATSTK], 
					[SNR], 
					[TEXT], 
					[UMB_LNR], 
					[UMB_LORT], 
					[BEW_MENGE], 
					[EKP], 
					[ESTP], 
					[KEIN_DP], 
					[INV_NR], 
					[INVDAT],
					[DEKP], 
					[DESTP], 
					[BESTAND], 
					[BEW_BEST], 
					[DIM1], 
					[DIM2], 
					[DIM3], 
					[LIEFERNR], 
					[BESTAND_V], 
					[DEKP_V], 
					[DESTP_V], 
					[MENGE_VE], 
					[EXT_SNR], 
					[LORTZ]
				) VALUES (
					@tenant_id,								-- [MANDANT]
					@stock_id,								-- [LNR]
					@stock_location_id,						-- [LORT] 
					@item_type,								-- [TYP] 
					@item_id,								-- [KEY]
					@date,									-- [DATUM]
					CONVERT(VARCHAR, @date, 108),			-- [ZEIT]
					1,										-- [LFD]
				 	@username,								-- [ERFASSER]
					@operation_type,						-- [BA]
					@item_quantity,							-- [MENGE]
					0,										-- [V_AUFTRAG]
					@order_internal_id,						-- [V_AUFT]
					0,										-- [V_AUFTPOS]
					0,										-- [V_VORGANG]
					0,										-- [V_VORGPOS]
					0,										-- [FORMAT]
					0,										-- [FORMATSTK]
					0,										-- [SNR]
					@operation_description,					-- [TEXT]
					0,										-- [UMB_LNR]
					0,										-- [UMB_LORT]
					@item_quantity,							-- [BEW_MENGE]
					0,										-- [EKP]
					0,										-- [ESTP]
					0,										-- [KEIN_DP]
					0,										-- [INV_NR]
					null,									-- [INVDAT]
					0,										-- [DEKP]
					0,										-- [DESTP]
					@new_inventory,							-- [BESTAND]
					@new_inventory,							-- [BEW_BEST]
					0,										-- [DIM1]
					0,										-- [DIM2]
					0,										-- [DIM3]
					'',										-- [LIEFERNR]
					0,										-- [BESTAND_V]
					0,										-- [DEKP_V] 
					0,										-- [DESTP_V] 
					0,										-- [MENGE_VE]
					@item_serial_number,					-- [EXT_SNR]
					0										-- [LORTZ]
				)
		END
	END
	ELSE IF @item_type = 'T'
	BEGIN
		THROW 50004, 'Error item_type T is not implemented now.', 1;
	END
	ELSE
	BEGIN 
		THROW 50003, 'Error item_type is not valid.', 1;
	END
END