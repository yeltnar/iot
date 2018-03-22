import {Things, Thing} from "../class/thing";

function selfParseInit(things:Things, hueFunc, helpers){

	let self_parse = new Thing("self_parse", things);
	self_parse.addCallback("do_self_parse", (...params)=>{ 
		console.log("notify "+[...params]);
		return doSelfParse(...params);
	});

	async function doSelfParse( ...params ){

		let s = params[0];

		console.log("do self parse - "+s);

		let timeout = 5*60*1000;

		if( /do the thing/i.test(s) ){
			things.getThing("bedroom_light").callCallback("on");
			await helpers.timeoutPromise(timeout);
			await things.getThing("bedroom_light").callCallback("off");
			await things.getThing("notification").callCallback("notify", ["Light timeout","Lasted "+timeout/1000/60+" min"]);
		}

		if( /bedroom timer/i.test(s) && /[0-9]+/i.test(s) ){

			min =  /[0-9]+/i.exec(s)[0];
			timeout = min*60*1000;

			things.getThing("bedroom_light").callCallback("on");
			await helpers.timeoutPromise(timeout);
			await things.getThing("bedroom_light").callCallback("off");
			await things.getThing("notification").callCallback("notify", ["Light timeout","Lasted "+timeout/1000/60+" min"]);
		}	

		return ;
	}
}



export{selfParseInit}