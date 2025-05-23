USE [Zimmer_Prod]
GO
/****** Object:  StoredProcedure [dbo].[sp_bde_order_fetch]    Script Date: 03.12.2024 16:57:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_bde_order_fetch]

AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		V.VORGANG,
		V.VORGNR, 
		V.ERSTELLT,
		VZ.LTPROD,
		V.KURZBEZ,
		V.KUNR,
		A.NAME1,
		A.UIDLAND,
		VZ.VORGTYP,
		REPLACE(VT.BEZ, ' (' + VT.KURZ + ')', '') AS BEZ,
		VT.KURZ,
		VT.GRUPPE
	FROM 
		VORGANG AS V 
	LEFT JOIN 
		VORGANG_ZD AS VZ 
		ON V.VORGANG = VZ.VORGANG
	LEFT JOIN
		ADRESSEN AS A
		ON V.KUNR = A.NUMMER
	LEFT JOIN 
		VARTYPEN AS VT
		ON VZ.VORGTYP = VT.NUMMER
	WHERE 
		VT.KENNUNG = 'VA'
		AND VZ.GESPERRT = 'N' 
		AND V.VORGART = 2 
		AND V.PARENT != 0 
		--AND VZ.LTPROD < DATEADD(YEAR, 1, GETDATE()) 
		AND VZ.GELIEFERT IS NULL
		ORDER BY VZ.LTPROD DESC, V.VORGANG ASC;
END
