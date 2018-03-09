import * as requestP from "request-promise-native";
import {Things, Thing} from "./class/thing";

let config={};
let things:Things;

function getNewCommands(){
	let options={
		uri:config.popUrl
	};
	return requestP(options);
}

function doNewCommands( command ){
	return new Promise((resolve, reject)=>{

		if(command === undefined || command === "undefined" || command.indexOf("that que does not exsist")>=	0){
			console.log("BAD: command is '"+command+"'")
			return reject("command is "+command)
		}else if(false){

		}else{
			try{
				let {device, state, params} = JSON.parse(command);
				console.log( "device is: '"+device+"' state is:'"+state+"' params is: '"+params+"'" );

				params = params || [];

				things.getThing(device).callCallback(state, ...params)
				.catch((e)=>{
					console.log("request problem");
					reject(e);
				})

				console.log("processed: '"+command+"'")
			}catch( e ){
				things.getThing("notification").callCallback("notify", "Failure", "doNewCommands("+command+")");
			}
			return resolve();
		}
		
	});
}

function loop( msToNextLoop=0 ){
	console.log("\n"+msToNextLoop)

	getNewCommands()
	.then(doNewCommands)
	.then(()=>{
		msToNextLoop = config.shortLoop
		setTimeout(()=>{
 			loop(config.shortLoop);
		},msToNextLoop);
	})
	.catch((...e)=>{
		setTimeout(()=>{
			loop(config.longLoop);
		},msToNextLoop);
	})

	
}

function googleDriveInit(configIn, incomingThings:Things){
	config = configIn;
	things = incomingThings;
	
	//loop();

	return;
};

export {googleDriveInit}