import {Things, Thing} from "../class/thing";

const requestP = require("request-promise-native");
const fs = require("fs");

let webServerConfig;

let things;

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

export function webServerInit( local_webServerConfig:object, local_things:Things ){//}catch(e){console.error(e);console.log("failed to call webServerInit");}
	things = local_things;
	try{
		webServerConfig = local_webServerConfig;

		const file_server = things.createAddThing("web_server");
		file_server.addCallback("get_file",getFile)
		file_server.addCallback("get_things",getThings)
	}catch(e){console.error(e);console.log("failed to call webServerInit");}
	
	return things;
}
