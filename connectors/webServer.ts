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
	try{
		console.log("things.toObj()");
		console.log(things.toObj());
	}catch(e){
		console.log(e);
	}
	return things.toObj();
	//return "things.toObj()";
}

export function webServerInit( local_webServerConfig:object, local_things:Things ){
	webServerConfig = local_webServerConfig;
	things = local_things;

	const file_server = things.createAddThing("web_server");
	file_server.addCallback("get_file",getFile)
	file_server.addCallback("get_things",getThings)
	
	return things;
}
