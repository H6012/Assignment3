//David Powell
//npm install mqtt
//npm install mysql
//
//You must have a connection to the database for this program to work!!!! 
//If your running this locally on your PC this needs to be done via an SSH Tunnel, forwarding port 3306
//
//


/*
1. Modify the fields in the script below below to match your database
	  user: "xxx",
	  password: "xxxx",
	  database: "xxx_db",


2. On the MySQL command prompt you can configure a dummy database:- 

swtich to your database (USE xxxx_db;) and run the following SQL code. 

create table Charger(
	id int(11) NOT NULL AUTO_INCREMENT,
	status int not null,
	description varchar(100) not null,
	primary key( id)
)AUTO_INCREMENT=1;

INSERT INTO Charger(status, description) VALUES(0,'D15 charger'),(1,'D4 charger'),(-1,'D1 charger');

*/

const mqtt = require('mqtt');  
var mysql = require("mysql");

const client = mqtt.connect('mqtt://178.62.29.184' );



client.on('connect', () => {  
  client.subscribe('charger/message_up');
   
})

client.on('message', (topic, message) => {  
  if(topic === 'charger/message_up') {
    
	console.log('Message = ' + message.toString());
	
	var data = JSON.parse(message);
	
	if(data.request=='status'){
		console.log('Looking up database for ID ' + data.id);
		
		//Look up database! 
		var con = mysql.createConnection({
		  host: "localhost",
		  user: "xxx",
		  password: "xxxx",
		  database: "xxx_db",
		  multipleStatements: true
		});

		con.connect(function(err){
		  if(err){
			console.log('Error connecting to Db');
			return;
		  }
		  console.log('Connection established');  
		});
		
		con.query('select status FROM Charger WHERE id='+data.id+';',function(err,rows){ 
			if(err) { console.log('Error reading Db'); return; } 
			console.log('Found ' + rows.length);  
			if(rows.length==0){
				//Request the status of charger from the DB
				client.publish('charger/message_down', '{"response":"error", "msg":"charger doesn\'t exist"}');
			}
			
			else{
				client.publish('charger/message_down', '{"response":"status", "value":'+rows[0].status+'}');
			}
			
			});
		
		
		con.end(function(err) {
		  // The connection is terminated gracefully
		  // Ensures all previously enqueued queries are still
		  // before sending a COM_QUIT packet to the MySQL server.
		}); 
		
	
	}
	
	
	
	}
})