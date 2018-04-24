const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let androidConfig;
let things;
let helpers;

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

async function randomWallpaper(){
	 let search = await helpers.reddit.search("earthporn", "top", 15, "day");
	 let usedImg = (await getUsedPhoneWallpapers()) || []; // TODO actually set this

	 search = search.data.children.map(ele=>ele.data.url);
	 search = search.filter( e => !usedImg.includes(e) )

	 console.log("android walpaper serach...");
	 console.log(search);
}

async function setPhoneWallpaper(){}

async function getUsedPhoneWallpapers(){
	let toRet = await helpers.fsPromise.readFile("data/usedPhoneWallpapers.json");
	return toRet;
}

async function recordLocation_home(params){

	params = JSON.stringify(params) || "undefined";

	things.getThing("notification").callCallback("notify",["record home",params]);
	things.getThing("notification").callCallback("notify",["Called recordLocation","home"]);

	return "recordLocation_home";
}
async function recordLocation_away(params){

	params = JSON.stringify(params) || "undefined";

	things.getThing("notification").callCallback("notify",["record away",params]);
	things.getThing("notification").callCallback("notify",["Called recordLocation","away"]);

	return "recordLocation_away";
}

export function androidInit( local_androidConfig:object, local_things:Things, local_helpers ){
	things = local_things
	androidConfig = local_androidConfig;
	helpers = local_helpers

	try{
		let pixel2xl = new Thing("pixel2xl", things);
		pixel2xl.addCallback("tasker",(...params)=>{
			return sendToTasker(...params);
		});
		let pixel2xl_location = new Thing("pixel2xl_location", things);
		pixel2xl_location.addCallback("home",recordLocation_home);
		pixel2xl_location.addCallback("away",recordLocation_away);
	}catch(e){console.error(e);console.log("failed to call androidInit")}

	randomWallpaper()
	
	return local_things;
}
