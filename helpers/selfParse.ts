import {Things, Thing} from "../class/thing";

function selfParseInit(things:Things, hueFunc, helpers){

	let self_parse = new Thing("self_parse", things);
	self_parse.addCallback("do_self_parse", (...params)=>{ 
		console.log("notify "+[...params]);
		return doSelfParse(...params);
	});

	async function doSelfParse( ...params ){

		let s = params[0];

		console.log("do self parse - ");

		if( /do the thing/i.test(s) ){
			await things.getThing("bedroom_light").callCallback("on");
			await helpers.timeoutPromise(5*60*1000);
			await things.getThing("bedroom_light").callCallback("off");
		}

		return ;
	}
}



export{selfParseInit}