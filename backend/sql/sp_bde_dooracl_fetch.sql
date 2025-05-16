USE [Zimmer_Prod]
GO
/****** Object:  StoredProcedure [dbo].[sp_bde_dooracl_fetch]    Script Date: 27.01.2025 08:51:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_bde_dooracl_fetch]
	@bde_id INT,
	@bde_target INT
AS
BEGIN
	SET NOCOUNT ON;
	-- get terminal access attribute from user
	DECLARE @user_id AS INT
	DECLARE @terminal_acl AS INT
	SELECT 
		@user_id = P.PERSNR,
		@terminal_acl = P.TERMINALS
		FROM PERSON AS P WHERE 
			P.BDE_NR = @bde_target
	
	IF @user_id = 0
	BEGIN
		THROW 50001, 'Error: User was not found in db.', 1;
	END

	-- all terminal allowed
	IF @terminal_acl = 0
	BEGIN
		SELECT 
			P.SYSID,
			P.PERSNR,
			P.FAMNAME,
			P.VORNAME,
			P.EMAIL
				FROM PERSON AS P WHERE P.PERSNR = @user_id
	END

	-- only terminals that are in the accesslist
	IF @terminal_acl = 1
	BEGIN
		--SELECT * FROM TERMINAL AS T WHERE T.TERM_ID = @bde_id
		DECLARE @terminal_id AS INT
		SELECT 
			@terminal_id = T.TERM_ID
			FROM GRPASSOC AS A 
				RIGHT JOIN TERMINAL AS T ON A.GRUPPE = T.GRUPPE
			WHERE 
				A.ASSOC = @user_id AND
				T.TERM_ID = @bde_id
		
		IF @terminal_id > 0
		BEGIN
			SELECT 
				P.SYSID,
				P.PERSNR,
				P.FAMNAME,
				P.VORNAME,
				P.EMAIL
					FROM PERSON AS P WHERE P.PERSNR = @user_id
		END
		ELSE
		BEGIN
			THROW 50002, 'Error: User is not allowed from this terminal.', 1;
		END
	END

	-- no terminal
	IF @terminal_acl = 2
	BEGIN
		THROW 50003, 'Error: User is not allowed to login from any terminal.', 1;
	END
END
