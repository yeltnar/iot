import {Things, Thing} from "../class/thing";

function initIfttt(things:Things){

	let ifttt = [
		{
			"states":[ // list of states that all must be true to fire action
				{
					"thing":"desk_socket",
					"state":"on"
				},
				{
					"thing":"desk_socket",
					"state":"off"
				}
			],
			"action":function(){
				console.log("doing action on")
				// /console.log( new Error("getting stack") )
				things.getThing("notification").callCallback("notify", "Desk power on", "on");
			}
		}
	]

	return ifttt;

}

export {initIfttt}