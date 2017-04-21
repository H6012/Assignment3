



var mysql = require("mysql");

var charger_state = 0;
var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    console.log("you entered: [" +d.toString().trim() + "]");
	
	
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "xxxxx",
	  database: "xx_db",
	  multipleStatements: true
	});

	con.connect(function(err){
	  if(err){
		console.log('Error connecting to Db');
		return;
	  }
	  //console.log('Connection established');
	});

	var user_id= parseInt(d.toString().trim());
	
	if(charger_state==0){
		console.log('Request To Start Charging for ' + user_id);
		con.query('CALL START_CHARGE('+user_id+',1,@ret_val,@ret_msg); select @ret_val, @ret_msg;',function(err,rows){ 
		if(err) { console.log('Error reading Db'); return; } 
						
		console.log(rows[1][0]["@ret_msg"] + " " + rows[1][0]["@ret_val"]);
		//only start charging if user was in the database
		if(rows[1][0]["@ret_val"]==0)
			charger_state=1;
		});
	}
	if(charger_state==1){
		console.log('Request To Stop Charging for ' + user_id);
		con.query('CALL STOP_CHARGE('+ user_id +',1,@ret_val,@ret_msg); select @ret_val, @ret_msg;',function(err,rows){ 
		if(err) { console.log('Error reading Db'); return; } 
		
		console.log(rows[1][0]["@ret_msg"] + " " + rows[1][0]["@ret_val"]);
		//only stop charging if user was in the database
		if(rows[1][0]["@ret_val"]==0)
			charger_state=0;
		});
	}
	
	con.end(function(err) {
	  // The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	});
	
  });
  
	
	
