const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let weatherConfig;

let things;

export function weatherInit( local_weatherConfig:object, local_things:Things ){
	weatherConfig = local_weatherConfig;
	things = local_things;

	let weather = things.createAddThing("weather");
	weather.addCallback("on", async ()=>{
		things.getThing("notification").callCallback("notify",["weather_engine recorded to be 'on'","weather_engine recorded to be 'on'"]);
		return "weather recorded to be 'on'"
	},);
	
	return things;
}
