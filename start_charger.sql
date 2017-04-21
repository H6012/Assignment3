DROP PROCEDURE START_CHARGE;
DELIMITER //
CREATE PROCEDURE START_CHARGE(IN user_id int, IN charger_id int, OUT ret_val int, OUT ret_msg VARCHAR(50))
ThisSP:BEGIN
 
DECLARE bal FLOAT DEFAULT 0;
DECLARE unit_status INT DEFAULT 0;

SET ret_val = 0;
SELECT balance INTO bal FROM Owner WHERE Owner.id = user_id;

IF FOUND_ROWS() <> 1 THEN 
	SET ret_val = -1;
	SET ret_msg = 'Unable to find owner';
	LEAVE ThisSP;
ELSEIF bal < 1.00 THEN 
	SET ret_val = -2;
	SET ret_msg = 'No Credit';
	LEAVE ThisSP;
END IF;


SELECT status INTO unit_status FROM Charger WHERE Charger.id = charger_id ;
IF FOUND_ROWS() <> 1 THEN 
	SET ret_val = -3;
	SET ret_msg = 'Unable to find charger';
	LEAVE ThisSP;	
ELSEIF unit_status <> 0 THEN 
	SET ret_val = -4;
	SET ret_msg = 'Charger not available';
	LEAVE ThisSP;
END IF;


UPDATE Charger SET Charger.status = 1 WHERE Charger.id = charger_id ;

SET ret_msg = 'Charger ready to charge';

END //
DELIMITER ;