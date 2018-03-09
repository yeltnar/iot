const config = require('config');
import {endpointsInit} from "./endpoints/endpoints";
import {iftttInit} from "./connectors/ifttt";
import {Things, Thing} from "./class/thing";
import {aliasInit} from "./alias";
import {googleDriveInit} from "./connectors/googleDrive";
import {hueInit} from "./connectors/hue";

let things = new Things("Drew's IOT");

iftttInit(config.ifttt, things);
endpointsInit(config.express, things);
hueInit(config.hue, things);
aliasInit(things); // this needs to be last
googleDriveInit(config.googleDrive, things);

//things.getThing("notification").callCallback("notify", "title", "message "+(Date.now().toString()), "http://google.com");
// things.getThing("desk_socket").callCallback("off");
// let s = things.getThing("desk_socket").getState()
// console.log(s)