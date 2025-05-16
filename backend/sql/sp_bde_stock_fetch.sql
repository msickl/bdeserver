USE [Zimmer_Prod]
GO
/****** Object:  StoredProcedure [dbo].[sp_bde_stock_fetch]    Script Date: 05.12.2024 08:48:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_bde_stock_fetch]
	@tenant_id INT,								-- 1 Standard
    @stock_id INT,								-- 1 Standard
    @stock_location_id INT						-- 3 Standard
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @stock_id_name AS VARCHAR(100)
	DECLARE @stock_location_id_name AS VARCHAR(100) 

	SELECT 
		@stock_id_name = L.BEZ
		FROM LAGSTAMM AS L WHERE 
			L.MANDANT = @tenant_id AND 
			L.LNR = @stock_id

	SELECT 
		@stock_location_id_name = O.BEZ 
		FROM LAGORT AS O WHERE 
			O.MANDANT = @tenant_id AND 
			O.LNR = @stock_id AND 
			O.LORT = @stock_location_id

	SELECT 
		@tenant_id AS 'tenant_id', 
		@stock_id AS 'stock_id', 
		@stock_location_id AS 'stock_location_id', 
		@stock_id_name AS 'stock_id_name', 
		@stock_location_id_name AS 'stock_location_id_name'
END
