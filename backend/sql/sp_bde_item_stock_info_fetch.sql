USE [Zimmer_Prod]
GO
/****** Object:  StoredProcedure [dbo].[sp_bde_item_stock_info_fetch]    Script Date: 05.12.2024 15:12:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_bde_item_stock_info_fetch]
	@tenant_id INT,				-- 1 Default
	@item_id VARCHAR(8)			-- A124537
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @item_type AS VARCHAR(1)
	SET @item_type = LEFT(@item_id, 1)

	SET @item_id = RIGHT(@item_id, LEN(@item_id) - 1)

	IF @item_type = 'A'
	BEGIN
		SELECT 
    L.LNR,
    L.LORT,
    L.PLATZ,
    (
        SELECT TOP 1 LB.BESTAND
        FROM LAGB AS LB
        WHERE LB.MANDANT = @tenant_id
          AND LB.TYP = L.TYP
          AND LB.[KEY] = L.[KEY]
          AND LB.LNR = L.LNR
          AND LB.LORT = L.LORT
        ORDER BY LB.[SYSID] DESC
    ) AS BESTAND,
	CONCAT((
		SELECT R.MENGE FROM
		RESERVIERT R 
		WHERE R.MANDANT = @tenant_id
		AND R.TYP = L.TYP
		AND R.[KEY] = L.[KEY]
		AND R.LNR = L.LNR
		AND R.LORT = L.LORT
	),0) AS RESERVIERT,
	CONCAT((
		SELECT SUM(P.POSMENGE) FROM 
		VORGANG AS V LEFT JOIN VORGPOS AS P ON V.VORGANG = P.VORGANG 
		WHERE 
			V.VORGART = 13 AND 
			V.[STATUS] in ('D', 'T') AND 
			P.TYP = L.TYP AND 
			P.[KEY] = L.[KEY] AND 
			P.STATUS_L = 'N' AND
			P.LORT = L.LORT AND
			P.LNR = L.LNR
	),0) AS BESTELLT
FROM LAGER AS L
WHERE L.TYP = @item_type
  AND L.[KEY] = @item_id;
	END
END
