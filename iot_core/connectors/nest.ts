const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let nestConfig;

let things;

export function nestInit( local_nestConfig:object, things:Things ){
	try{
		nestConfig = local_nestConfig;
	}catch(e){console.error(e);console.log("failed to call nestInit")}
	
	return things;
}
