const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let androidConfig;

let things;

function sendToTasker(text=""){

	//console.log(`pushNotification(title="", message="", link=""){`)

	let url = "https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?text="+text+"=:=&deviceId=93d87755c1cd40b393730259c1096ff5&apikey=4e5267df11734f0085829a771456ace9"

	let options = { 
		method: 'GET',
	  	url,
	};
	return requestP(options).then((results)=>{
		console.log("results is "+results);
	})

	//return requestP(options);

}

export function androidInit( local_androidConfig:object, things:Things ){
	androidConfig = local_androidConfig;

	let pixel2xl = new Thing("pixel2xl", things);
	pixel2xl.addCallback("tasker",(...params)=>{
		return sendToTasker(...params);
	});
	//deskSocket.addUrlCallback("off", {"url":androidConfig.first+"desk_power_off"+androidConfig.second}, ()=>{console.log("callback/desk power off")});
	//deskSocket.addUrlCallback("on", {"url":androidConfig.first+"desk_power_on"+androidConfig.second}, ()=>{console.log("callback/desk power on")});
	
	return things;
}
