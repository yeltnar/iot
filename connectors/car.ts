const requestP = require("request-promise-native");
import {Things, Thing} from "../class/thing";

let carConfig;

let things;

export function carInit( local_carConfig:object, local_things:Things ){
	things = local_things;
	try{
		carConfig = local_carConfig;

		let car = things.createAddThing("car", "off");
		car.addCallback("on", async ()=>{
			things.getThing("notification").callCallback("notify",["car_engine recorded to be 'on'","car_engine recorded to be 'on'"]);
			return "car recorded to be 'on'"}
		);
		car.addCallback("off", async ()=>{
			things.getThing("notification").callCallback("notify",["car_engine recorded to be 'off'","car_engine recorded to be 'off'"]);
			return "car recorded to be 'off'"
		});
		car.addCallback("fuel_level", async (...params)=>{
			car.setState(params[0]);
			things.getThing("notification").callCallback("notify",["fuel_level",JSON.stringify(params)]);
			return "recording fuel_level to be "+car.getState();
		});
		car.addCallback("stop_driving", async (params)=>{
			things.getThing("notification").callCallback("notify",["stop_driving",JSON.stringify(params)]);
			return "car stop_driving recorded";
		});
	}catch(e){console.error(e);console.log("failed to call carInit")}
	
	return things;
}
