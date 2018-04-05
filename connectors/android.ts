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

	async function recordLocation_home(params){

		things.getThing("notification").callCallback("notify",["record home",JSON.stringify(params)]);
		things.getThing("notification").callCallback("notify",["Called recordLocation","home"]);

		return "done";
	}

	let pixel2xl = new Thing("pixel2xl", things);
	pixel2xl.addCallback("tasker",(...params)=>{
		return sendToTasker(...params);
	});
	let pixel2xl_location = new Thing("pixel2xl_location", things);
	pixel2xl_location.addCallback("home",recordLocation_home);
	
	return things;
}
