const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let weatherConfig;

let things;

export function weatherInit( local_weatherConfig:object, local_things:Things ){
	things = local_things;
	try{
		weatherConfig = local_weatherConfig;

		let weather = things.createAddThing("weather");
		weather.addCallback("on", async ()=>{
			things.getThing("notification").callCallback("notify",["weather_engine recorded to be 'on'","weather_engine recorded to be 'on'"]);
			return "weather recorded to be 'on'"
		},);
	}catch(e){console.error(e);console.log("failed to call weatherInit")}
	
	return things;
}
