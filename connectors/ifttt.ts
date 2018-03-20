const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let iftttConfig;

let things;

function pushNotification(title="", message="", link=""){

	//console.log(`pushNotification(title="", message="", link=""){`)

	let url = iftttConfig.first+iftttConfig.push_notification+iftttConfig.second

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
	return requestP(options).then((results)=>{
		console.log("results is "+results);
	})

	//return requestP(options);

}

const data = {
	"desk_socket":{
		"state":"unknown",
		"callbacks":{
			"on":undefined,
			"off":undefined
		}
	}
}

export function iftttInit( local_iftttConfig:object, things:Things ){
	iftttConfig = local_iftttConfig;

	let deskSocket = new Thing("desk_socket", things);
	deskSocket.addUrlCallback("off", {"url":iftttConfig.first+"desk_power_off"+iftttConfig.second}, ()=>{console.log("callback/desk power off")});
	deskSocket.addUrlCallback("on", {"url":iftttConfig.first+"desk_power_on"+iftttConfig.second}, ()=>{console.log("callback/desk power on")});
	
	// let livingRoomLight = new Thing("living_room_light", things);
	// livingRoomLight.addUrlCallback("off", {"url":iftttConfig.first+"living_room_light_off"+iftttConfig.second}, ()=>{console.log("living room light off")});
	// livingRoomLight.addUrlCallback("on", {"url":iftttConfig.first+"living_room_light_on"+iftttConfig.second}, ()=>{console.log("living room light on")});

	// let bedroomLight = new Thing("bedroom_light", things);
	// bedroomLight.addUrlCallback("off", {"url":iftttConfig.first+"bedroom_light_off"+iftttConfig.second}, ()=>{console.log("bedroom off")});
	// bedroomLight.addUrlCallback("on", {"url":iftttConfig.first+"bedroom_light_on"+iftttConfig.second}, ()=>{console.log("bedroom on")});

	let notification = new Thing("notification", things);
	notification.addCallback("notify", (...params)=>{ 
		//console.log("notify "+[...params]);
		return pushNotification(...params);
	});
	
	return things;
}
