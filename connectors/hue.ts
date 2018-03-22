import {Things, Thing} from "../class/thing";

const requestP = require("request-promise-native");

function hueInit(hueConfig, things, helpers){

	let user = "EByeQOPuSZvgsiSgKGYpOTqKwYJnpVo6TqkxZ5Gh"; // TODO move this to config
	let baseAddress = "http://192.168.1.111/api"

	let exposedFunctions = {
		getLightState,
		getLight,
		setLightState
	};

	function getLightState(lightNumber:number){

		if(lightNumber===undefined){throw new Error("lightNumber not defined");}

		return new Promise((resolve, reject)=>{
			getLight(lightNumber).then((light)=>{
				resolve(light.state.on);
			});
		});

	}

	function getLight(lightNumber:number){

		if(lightNumber===undefined){throw new Error("lightNumber not defined");}

		return new Promise((resolve, reject)=>{
			getLights().then((lights)=>{
				lights = JSON.parse(lights);
				resolve( lights[lightNumber] );
			});
		});

	}

	function getLights(){
		let options = {
			"url":baseAddress+"/"+user+"/lights",
			"method":"GET"
		};
		return requestP(options);
	}

	function getIdByName(lightsObject){

	}

	// currently not used
	function delayLightState(id, on, seconds){
		setTimeout(()=>{
			setLightState(id, on);
		},seconds*1000);
	}

	///api/<username>/lights/<id>
	function setLightState(id, on=true){
		if(id===undefined){throw new Error("light id must be defined");}
		if(on===undefined){throw new Error("light state must be defined");}

		let options = { 
			method: 'PUT',
		  	url: baseAddress+'/'+user+'/lights/'+id+'/state',
		  	body: JSON.stringify({on})
		};
		return requestP(options);
	}

	// getLights().then((resp)=>{
	// 	resp = JSON.parse(resp);
	// 	setLightState(2, !resp[2].state.on).then((resp2)=>{
	// 		console.log(resp2);
	// 	})
	// });

	var options = { method: 'PUT',
	  url: 'http://192.168.1.111/api/EByeQOPuSZvgsiSgKGYpOTqKwYJnpVo6TqkxZ5Gh/lights/2/state',
	  body: '{"on":false}' 
	};

	//delayLightState(2, false, 0);


	let light1 = new Thing("living_room_light", things);
	light1.addCallback("off", ()=>{ console.log("living_room_light off");return setLightState(1, false); })
	light1.addCallback("on", ()=>{ console.log("living_room_light on");return setLightState(1, true); })

	let light2 = new Thing("bedroom_light", things);
	light2.addCallback("off", ()=>{ console.log("bedroom_light off");return setLightState(2, false); })
	light2.addCallback("on", ()=>{ console.log("bedroom_light on");return setLightState(2, true); })

	return exposedFunctions; 
}

export {hueInit}