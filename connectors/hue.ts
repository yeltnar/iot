import {Things, Thing} from "../class/thing";

const requestP = require("request-promise-native");

let user = "EByeQOPuSZvgsiSgKGYpOTqKwYJnpVo6TqkxZ5Gh";
let baseAddress = "http://192.168.1.111/api"

function getLights(){
	let options = {
		"url":baseAddress+"/"+user+"/lights",
		"method":"GET"
	};
	return requestP(options);
}

function getIdByName(lightsObject){

}

function delayLightState(id, on, seconds){
	setTimeout(()=>{
		setLightState(id, on);
	},seconds*1000);
}

///api/<username>/lights/<id>
function setLightState(id, on=true){
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

function hueInit(hueConfig, things){

	let light1 = new Thing("living_room_light", things);
	light1.addCallback("off", ()=>{ console.log("living_room_light on");return setLightState(1, false); })
	light1.addCallback("on", ()=>{ console.log("living_room_light off");return setLightState(1, true); })

	let light2 = new Thing("bedroom_light", things);
	light2.addCallback("off", ()=>{ console.log("bedroom_light on");return setLightState(2, false); })
	light2.addCallback("on", ()=>{ console.log("bedroom_light off");return setLightState(2, true); })

	return;
}

export {hueInit}