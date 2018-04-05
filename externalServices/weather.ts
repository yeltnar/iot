const requestP = require("request-promise-native");

let weatherConfig;

async function getSunRiseSet(){
	let astronomyUrl = "http://api.wunderground.com/api/a4098c913918bdde/conditions/astronomy/q/TX/Dallas.json";
	let data = await requestP(astronomyUrl);
	data = JSON.parse(data);

	data.sun_phase.sunrise.hour = parseInt(data.sun_phase.sunrise.hour);
	data.sun_phase.sunrise.minute = parseInt(data.sun_phase.sunrise.minute);
	data.sun_phase.sunset.hour = parseInt(data.sun_phase.sunset.hour);
	data.sun_phase.sunset.minute = parseInt(data.sun_phase.sunset.minute);
	
	return data.sun_phase;
}

function weatherInit(local_weatherConfig, things, helpers){
	weatherConfig = local_weatherConfig;

	let sunThing = things.createAddThing("sun");
	sunThing.addCallback("up", async ()=>{});
	sunThing.addCallback("down", async ()=>{});

	(async()=>{

		let {sunrise, sunset} = await getSunRiseSet();
		let now = new Date();
		let rise = new Date();
		let set = new Date();

		rise.setHours(sunrise.hour);rise.setMinutes(sunrise.minute);rise.setSeconds(0);rise.setMilliseconds(0);
		set.setHours(sunset.hour);set.setMinutes(sunset.minute);set.setSeconds(0);set.setMilliseconds(0);

		if( now > rise && now < set ){
			sunThing.callCallback("up").catch(()=>{console.log("err");});
			console.log("sun is up")
		}else{
			sunThing.callCallback("down").catch(()=>{console.log("err");});;
			console.log("sun is down")
		}

		console.log("rise is "+rise.toString());
		console.log("now is "+now.toString());
		console.log("set is "+set.toString());

		helpers.scheduleAction({"hr":0,"min":0},async ()=>{

			let {sunrise, sunset} = await getSunRiseSet();

			helpers.scheduleAction({"min":sunrise.minute,"hr":sunrise.hour},()=>{
				sunThing.callCallback("up");
			},false);

			helpers.scheduleAction({"min":sunset.minute,"hr":sunset.hour},()=>{
				sunThing.callCallback("down");
			},false);

		}, true);
	})()

	return {getSunRiseSet};
}

export {weatherInit};