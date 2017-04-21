var mysql = require("mysql");


var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    console.log("you entered: [" +d.toString().trim() + "]");
	
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "xxx",
	  database: "xxx_db",
	  multipleStatements: true
	});

	con.connect(function(err){
	  if(err){
		console.log('Error connecting to Db');
		return;
	  }
	  //console.log('Connection established');
	  
	  
	});

	
	if(d.toString().trim()=='start'){
		con.query('CALL START_CHARGE(1,1,@ret_val,@ret_msg); select @ret_val, @ret_msg;',function(err,rows){ 
		if(err) { console.log('Error reading Db'); return; } 
						
		console.log(rows[1][0]["@ret_msg"] + " " + rows[1][0]["@ret_val"]);
		});
	}
	if(d.toString().trim()=='stop'){
		con.query('CALL STOP_CHARGE(1,1,@ret_val,@ret_msg); select @ret_val, @ret_msg;',function(err,rows){ 
		if(err) { console.log('Error reading Db'); return; } 
		
		console.log(rows[1][0]["@ret_msg"] + " " + rows[1][0]["@ret_val"]);
		});
	}
	
	con.end(function(err) {
	  // The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	});
	
  });
  
	
	
