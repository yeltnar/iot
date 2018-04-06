const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let nestConfig;

let things;

export function nestInit( local_nestConfig:object, things:Things ){
	nestConfig = local_nestConfig;
	
	return things;
}
