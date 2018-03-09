const requestP = require("request-promise-native");

let iftttObj = {
	"first":"https://maker.ifttt.com/trigger/",
	"second":"/with/key/bXrf4Mm5tIy0Bjis08SiYC"
}

let push_notification = "push_notification"

let things = {
	"desk_socket":{
		"states":{
			"on_url":iftttObj.first+"desk_power_on"+iftttObj.second,
			"off_url":iftttObj.first+"desk_power_off"+iftttObj.second
		}
	}
};


function setSocketState(id, on=true){

	let url = on ? things[id].states.on_url : things[id].states.off_url;

	let options = { 
		method: 'GET',
	  	url
	};
	return requestP(options);
}

function pushNotification(title="", message="", link=""){

	let url = iftttObj.first+push_notification+iftttObj.second

	let options = { 
		method: 'POST',
	  	url,
	  	headers:{
	  		"Content-Type":"application/json"
	  	},
	  	body: {
	  		"value1":title,
	  		"value2":message,
	  		"value3":link
	  	},
	  	json:true
	};
	return requestP(options);

}

//setSocketState("desk_socket", false);
pushNotification("okay", "message");