import {Things, Thing} from "../class/thing";

function stateListenerInit(things:Things, helpers){
	
	try{
		
		let arr = [
			{
				"states":[ // list of states that all must be true to fire action
					{
						"thing":"car",
						"state":"on"
					},
					{
						"thing":"car",
						"state":"off"
					}
				],
				"action":function(){
					console.log("doing action on")
					// /console.log( new Error("getting stack") )
					things.getThing("notification").callCallback("notify", ["car on", "on"]);
				}
			},
			{
				"states":[ // list of states that all must be true to fire action
					{
						"thing":"car",
						"state":"off"
					},
					{
						"thing":"pixel2xl_location",
						"state":"home"
					},
					{
						"thing":"sun",
						"state":"down"
					}
				],
				"action":async function(){
					console.log("car off at home");
					things.getThing("living_room_light").callCallback("on");
					things.getThing("notification").callCallback("notify",["special light trigger",":)"]);
				}
			}//,{
			// 	"states":[

			// 	],
			// 	"action":function(){

			// 	}
			// }
		]

		for( let i=0; i<arr.length; i++ ){
			addStatesListener( arr[i] );
		}

		function addStatesListener( statesListener ){
			for( let i=0; i<statesListener.states.length; i++ ){
				let state = statesListener.states[i]
				let f = makeCheckFunction(statesListener.states, statesListener.action)
				things.getThing( state.thing ).addAfterCallback( state.state, f );
			}
		}

		function makeCheckFunction(arr, f){
			return ()=>{
				console.log("in check function")

				let checkPassed = arr.reduce((acc, val)=>{
					if( acc && val.state === things.getThing(val.thing).getState() ){
						return true;
					}else{
						console.log(val.state)
						console.log(things.getThing(val.thing).getState())
						return false;
					}
				}, true)


				if(checkPassed){
					f();
				}
			}
		}

	}catch(e){console.error(e);console.log("failed to call stateListenerInit")}

}

export {stateListenerInit}