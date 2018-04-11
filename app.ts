const config = require('config');

// core
import {Things, Thing} from "./class/thing";
//connectors
import {iftttInit} from "./connectors/ifttt";
import {carInit} from "./connectors/car";
import {webServerInit} from "./connectors/webServer";
import {androidInit} from "./connectors/android";
import {timeInit} from "./connectors/time";
import {googleDriveInit} from "./connectors/googleDrive";
import {hueInit} from "./connectors/hue";
import {nestInit} from "./connectors/nest";
import {aliasInit} from "./alias"; // TODO move to better palce
//networking 
import {connectToSocketInit} from "./connectors/connectToSocket"; // TODO move this file to better location
import {endpointsInit} from "./endpoints/endpoints";
//complementary services
import {stateListenerInit} from "./stateListener/main";
import {weatherInit} from "./externalServices/weather"; // TODO move to data watchers
import {helpersInit} from "./helpers/helper";
import {selfParseInit} from "./helpers/selfParse";

let helpers = helpersInit(config.helpers);

let things = new Things("Drew's IOT");

// set up helpers
try{
	helpers.weather = weatherInit(config.weather, things, helpers);
}catch(e){console.error("helpers setup failed");}

// set up networking
try{
	endpointsInit(config.express, things);
	connectToSocketInit(config.socket, things);
}catch(e){console.error("networking setup failed");}

// set up connecters
try{
	iftttInit(config.ifttt, things);
	nestInit(config.nest, things);
	carInit(config.car, things);
	webServerInit(config.fileServer, things, helpers);
	androidInit(config.ifttt, things); // TODO make android config
	timeInit(things); // TODO make android config
	let hueFunc = hueInit(config.hue, things, helpers);
	googleDriveInit(config.googleDrive, things);
	aliasInit(things, hueFunc, helpers); // this needs to be last
	selfParseInit(things, hueFunc, helpers); // this needs to be last
	stateListenerInit(things, helpers); // this needs to be laster
}catch(e){console.error("connectors setup failed");}

//keep bluemix alive
try{
	let minute = parseInt(Math.random() * 60); // dfaq, syntax checking?
	let second = parseInt(Math.random() * 60); // dfaq, syntax checking?
	let hour = parseInt(Math.random() * 3)+2; // dfaq, syntax checking?
	
	ScheduleHolder.addEvent({hour, minute, second},()=>{
		// TODO actually do the thing
	},"keep_bm_alive");
}catch(e){}

// (async()=>{

// 	let rule = new ScheduleHolder.schedule.RecurrenceRule();
// 	rule.second = [0,15,30,45];

// 	let sec = ((new Date()).getSeconds()+10)%60
// 	console.log("sec is "+sec)
// 	ScheduleHolder.addEvent(rule,()=>{
// 		console.log("done");
// 		console.log(ScheduleHolder.getEvent("test").nextInvocation());
// 		ScheduleHolder.getEvent("test").cancelNext(true);
// 		console.log(ScheduleHolder.getEvent("test").nextInvocation());
// 	},"test");
// 	console.log("-----"+ScheduleHolder.getEvent("test").nextInvocation());
	
// })();
