import {Things, Thing} from "../class/thing";

const requestP = require("request-promise-native");
const fs = require("fs");

let webServerConfig;
let things;
let helpers;

const data = {
	"desk_socket":{
		"state":"unknown",
		"callbacks":{
			"on":undefined,
			"off":undefined
		}
	}
}

async function getFile( fileLocation ){
	let toReturn = "";
	try{
		toReturn = fs.readFileSync("public/"+fileLocation).toString();
	}catch(e){
		toReturn = e;
	}
	console.log("returning "+toReturn)
	return toReturn;
}

async function getThings( fileLocation ){
	return things.toObj();
}

async function getLogs( fileLocation ){
	return await helpers.execPromise("pm2 logs --nostream --lines 100");
}

export function webServerInit( local_webServerConfig:object, local_things:Things, local_helpers ){//}catch(e){console.error(e);console.log("failed to call webServerInit");}
	things = local_things;
	helpers = local_helpers;
	try{
		webServerConfig = local_webServerConfig;

		const web_server = things.createAddThing("web_server");
		web_server.addCallback("get_file",getFile)
		web_server.addCallback("get_things",getThings)
		web_server.addCallback("get_logs",getLogs)
	}catch(e){console.error(e);console.log("failed to call webServerInit");}
	
	return things;
}
