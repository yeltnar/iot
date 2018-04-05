import {Things, Thing} from "../class/thing";
//import {initIftttListener} from "./ifttt"
{
	// try{
	// 	if(this.watcherCallbacks[state]!==undefined){
	// 		for( let i=0; i<this.watcherCallbacks[state].length; i++ ){
	// 			let currentCheckingState = this.watcherCallbacks[state][i];
	// 			let shouldCallCallback = true;
	// 			for( let k in currentCheckingState.otherStates ){
	// 				let realState = this.thingsParent.getThing( currentCheckingState.otherStates[k].thing ).getState();
	// 				let testState = currentCheckingState.otherStates[k].state
	// 				if( testState !== realState ){
	// 					console.log("callCallback/"+currentCheckingState.otherStates[k].thing+" didn't pass -- testState "+testState+" -- realState "+realState);
	// 					shouldCallCallback=false;
	// 					break;
	// 				}
	// 			}
	// 			if(shouldCallCallback){console.log("did pass");this.watcherCallbacks[state][i].action();}
	// 		}
	// 	}
	// }catch(e){console.error(e);}
}

function stateListenerInit(things:Things){
	
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
				// },
				// {
				// 	"thing":"sun",
				// 	"state":"down"
				}
			],
			"action":function(){
				console.log("car off at home");
				things.getThing("living_room_light").callCallback("on");
				things.getThing("notification").callCallback("notify",["special light trigger",":)"]);
			}
		}
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

}

function stateListenerInit_old(things:Things){

	for( let i=0; i<arr.length; i++ ){
		addStatesListener( arr[i] );
	}

	function addStatesListener( statesListener ){
		for( let i=0; i<statesListener.states.length; i++ ){
			let state = statesListener.states[i]
			things.getThing( state["thing"] )
			.addAfter( state["state"], statesListener.states, statesListener.action );
		}
	}
}

export {stateListenerInit}