const config = require('config');
import {endpointsInit} from "./endpoints/endpoints";
import {iftttInit} from "./connectors/ifttt";
import {carInit} from "./connectors/car";
import {webServerInit} from "./connectors/webServer";
import {androidInit} from "./connectors/android";
import {timeInit} from "./connectors/time";
import {Things, Thing} from "./class/thing";
import {aliasInit} from "./alias";
import {googleDriveInit} from "./connectors/googleDrive";
import {hueInit} from "./connectors/hue";
import {connectToSocketInit} from "./connectors/connectToSocket";
import {stateListenerInit} from "./stateListener/main";
import {helpers} from "./helpers/helper";
import {weatherInit} from "./externalServices/weather";
import {selfParseInit} from "./helpers/selfParse";

let things = new Things("Drew's IOT");

helpers.weather = weatherInit(config.weather, things, helpers);
iftttInit(config.ifttt, things);
carInit(config.car, things);
webServerInit(config.fileServer, things);
androidInit(config.ifttt, things); // TODO make android config
timeInit(things); // TODO make android config
endpointsInit(config.express, things);
let hueFunc = hueInit(config.hue, things, helpers);
googleDriveInit(config.googleDrive, things);
connectToSocketInit(config.socket, things);
aliasInit(things, hueFunc, helpers); // this needs to be last
selfParseInit(things, hueFunc, helpers); // this needs to be last
stateListenerInit(things, helpers); // this needs to be laster

//things.getThing("car").callCallback("off");

// (async ()=>{
// 	let {sunrise, sunset} = await helpers.weather.getSunRiseSet();
// 	console.log
// 	console.log(sunrise)
// 	console.log(sunset)

// 	helpers.scheduleAction({"min":sunrise.minute,"hr":sunrise.hour},()=>{
// 		sunThing.callCallback("up");
// 	},false);

// 	helpers.scheduleAction({"min":sunset.minute,"hr":sunset.hour},()=>{
// 		sunThing.callCallback("down");
// 	},false);
// })()