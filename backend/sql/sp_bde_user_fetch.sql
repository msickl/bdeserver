USE [Zimmer_Prod]
GO
/****** Object:  StoredProcedure [dbo].[sp_bde_user_fetch]    Script Date: 05.12.2024 08:48:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_bde_user_fetch]
	@tenant_id INT,
	@user_id INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		P.SYSID,
		P.MANDANT,
		P.PERSNR,
		P.BDE_NR,
		P.NTUSER,
		P.FAMNAME,
		P.VORNAME
		FROM PERSON AS P WHERE 
			P.PERSNR = @user_id
END
