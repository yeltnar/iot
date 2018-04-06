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
import {weatherInit} from "./externalServices/weather";
import {helpers} from "./helpers/helper";
import {selfParseInit} from "./helpers/selfParse";

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
	webServerInit(config.fileServer, things);
	androidInit(config.ifttt, things); // TODO make android config
	timeInit(things); // TODO make android config
	let hueFunc = hueInit(config.hue, things, helpers);
	googleDriveInit(config.googleDrive, things);
	aliasInit(things, hueFunc, helpers); // this needs to be last
	selfParseInit(things, hueFunc, helpers); // this needs to be last
	stateListenerInit(things, helpers); // this needs to be laster
}catch(e){console.error("connectors setup failed");}
