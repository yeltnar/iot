import {Things, Thing} from "../class/thing";

let things;

let parsePairs=[
	{
		"regexp":"do the thing",
		"funct":async (s)=>{
			let supaGenericRegex = /thing:\((.*)\) callback:\((.*)\) params:\((.*)\)/
			if( supaGenericRegex.test(s) ){
				let regexResults = supaGenericRegex.exec(s);
				let thing = regexResults[1]
				let callback = regexResults[2]
				let params
				try{
					params = JSON.parse(regexResults[3]);
					console.log("params")
					console.log(params)
				}catch(e){
					params = regexResults[3];
					console.log("params parse failed "+params+" type "+typeof params)
				}
				things.getThing(thing).callCallback(callback, params);
			}
		}
	},{
		"regexp":"do the thing",
		"funct":async (s)=>{
			await Promise.all([
				// things.getThing("bedroom_light").callCallback("on"),
				// helpers.timeoutPromise(timeout),
				// things.getThing("bedroom_light").callCallback("off"),
				//things.getThing("notification").callCallback("notify", ["Light timeout","Lasted "+timeout/1000/60+" min"]),
				things.getThing("notification").callCallback("notify", ["Do the thing","Did the thing"])
			]);
			console.log("matched do the thing");
		}
	},{
		"regexp":"bedroom timer",
		"funct":async (s)=>{
			let timeout = 5*60*1000;

			let min =  parseInt(/[0-9]+/i.exec(s)[0]);
			timeout = min*60*1000;

			console.log("min is "+min);
			console.log("timeout is "+timeout);
			console.log("s is "+s);

			things.getThing("bedroom_light").callCallback("on");
			await helpers.timeoutPromise(timeout);
			await things.getThing("bedroom_light").callCallback("off");
			await things.getThing("notification").callCallback("notify", ["Light timeout","Lasted "+timeout/1000/60+" min"]);
			console.log("matched bedroom timer");
		}
	},{
		"regexp":"test",
		"funct":async (s)=>{
			console.log("matched test");
			return await things.getThing("notification").callCallback("notify", ["Test",(new Date()).toString()]);
		}
	}
]

function selfParseInit(local_things:Things, hueFunc, helpers){
	things = local_things;

	try{
		let self_parse = new Thing("self_parse", things);
		self_parse.addCallback("do_self_parse", (params)=>{ 
			console.log("notify "+params);
			return doSelfParse( params);
		});
	}catch(e){console.error(e);console.log("failed to call selfParseInit")}

	async function doSelfParse( params ){

		let s = params;

		console.log("do self parse - ***"+s+"***");

		for(let i=0; i<parsePairs.length; i++ ){
			let regexp = new RegExp(parsePairs[i].regexp);
			if(regexp.test(s)){
				parsePairs[i].funct(s);
			}
		}	

		if( /living ?room timer/i.test(s) && /[0-9]+/i.test(s) ){

			let min =  parseInt(/[0-9]+/i.exec(s)[0]);
			let timeout = min*60*1000;

			console.log("min is "+min);
			console.log("timeout is "+timeout);
			console.log("s is "+s);

			things.getThing("living_room_light").callCallback("on");
			await helpers.timeoutPromise(timeout);
			await things.getThing("living_room_light").callCallback("off");
			await things.getThing("notification").callCallback("notify", ["Light timeout","Lasted "+timeout/1000/60+" min"]);
			console.log("matched living room timer");
		}	

		if( /lights? timer/i.test(s) && /[0-9]+/i.test(s) ){

			let number =  parseInt(/[0-9]+/i.exec(s)[0]);

			let timeout;
			if( /minute/i.test(s) ){
				timeout = number*60*1000;
			}else if( /hours/i.test(s) ){
				timeout = number*60*60*1000;
			}else{
				timeout = number*1000;
			}

			console.log("timeout is "+timeout);
			console.log("s is "+s);

			things.getThing("bedroom_light").callCallback("on");
			things.getThing("living_room_light").callCallback("on");
			await helpers.timeoutPromise(timeout);
			await Promise.all([
				things.getThing("bedroom_light").callCallback("off"),
				things.getThing("living_room_light").callCallback("off")
			])
			things.getThing("notification").callCallback("notify", ["Light timeout","Lasted "+timeout/1000/60+" min"]);
			console.log("matched lights timer");
		}
	}
}

export{selfParseInit};
