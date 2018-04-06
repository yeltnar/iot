const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let androidConfig;

let things;

async function updateTime(text=""){

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

export function timeInit( things:Things ){
	try{
		let time = new Thing("time", things);
		time.getState = Date.now;

		console.log(time.getState());

		//updateTime();
	}catch(e){console.error(e);console.log("failed to call timeInit")}
	
	return things;
}
