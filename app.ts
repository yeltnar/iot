const config = require('config');
import {endpointsInit} from "./endpoints/endpoints";
import {iftttInit} from "./connectors/ifttt";
import {Things, Thing} from "./class/thing";
import {aliasInit} from "./alias";
import {googleDriveInit} from "./connectors/googleDrive";
import {hueInit} from "./connectors/hue";
import {connectToSocketInit} from "./connectors/connectToSocket";
import {stateListenerInit} from "./stateListener/main";
import {helpers} from "./helpers/helper";

let things = new Things("Drew's IOT");

iftttInit(config.ifttt, things);
endpointsInit(config.express, things);
let hueFunc = hueInit(config.hue, things, helpers);
googleDriveInit(config.googleDrive, things);
connectToSocketInit(config.socket, things);
aliasInit(things, hueFunc, helpers); // this needs to be last
stateListenerInit(things); // this needs to be laster

things.getThing("alias").callCallback("flash_n_times", [2]);

//things.getThing("notification").callCallback("notify", "title", "message "+(Date.now().toString()), "http://google.com");
// things.getThing("desk_socket").callCallback("off");
// let s = things.getThing("desk_socket").getState()
// console.log(s)