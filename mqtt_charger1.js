//David Powell
//npm install mqtt

const mqtt = require('mqtt')  
const client = mqtt.connect('mqtt://178.62.29.184' )



client.on('connect', () => {  
	console.log('Connected');
  client.subscribe('charger/message_down');
   //Request the satus of charger from the DB
  client.publish('charger/message_up', '{"request":"status", "id":2}');
})

client.on('message', (topic, message) => {  
  if(topic === 'charger/message_down') {
    
	console.log('Message = ' + message);
	
	
	var data = JSON.parse(message);

	
	if(data.response=='status'){
		console.log('Charger Status value is ' +  data.value);
	}
	
	if(data.response=='error'){
		console.log('Charger Status value is ' +  data.msg);
	}
	
  }
})


