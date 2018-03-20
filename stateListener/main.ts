import {Things, Thing} from "../class/thing";
import {initIfttt} from "./ifttt"

function stateListenerInit(things:Things){
	
	let arr = []; 
	arr = arr.concat( initIfttt(things) );

	for( let i=0; i<arr.length; i++ ){
		addStatesListener( arr[i] );
	}

	function addStatesListener( statesListener ){
		for( let i=0; i<statesListener.states.length; i++ ){
			things.getThing( statesListener.states[i]["thing"] ).addWatcher( statesListener.states[i]["state"], statesListener.states, statesListener.action );
		}
	}
}

export {stateListenerInit}