let requestP = require('request-promise-native');
import {helpers} from "../helpers/helper";

class Thing{

	state: string;
	name: string;
	callbacks: object;
	thingsParent: Things;
	afterCallbacks: object;
	attributeTable:object={};

	constructor(name:string, thingsParent:Things, state?:string ){
		this.thingsParent = thingsParent;
		this.callbacks = {};
		this.name = name;
		this.afterCallbacks = {};
		thingsParent.addThing(this);
	}
	toString(thingSep="\n", keySep=" "){
		return "Name:"+this.name+";"+keySep+"State:"+this.state+";"+keySep+"Callbacks:"+JSON.stringify(Object.keys(this.callbacks))+keySep+"Parent name:"+this.thingsParent.name;
	}
	addCallback( callbackName:string, f:Function, recordState=true, expects?:object ){
		if( this.callbacks[callbackName] === undefined){
			// this.thingsParent.addStateChangeCallback( this.name, callbackName ); // sets it up if not
			this.callbacks[callbackName] = f;
			this.callbacks[callbackName].expects = expects;
		}else{
			throw "'"+callbackName+"' has already been set for "+this.name;
		}
	}
	addUrlCallback( name:string, options:object, inFunct=(data)=>{} ){
		this.addCallback(name, ()=>{

			return requestP( options )
			.then(helpers.tryToParsePromise)
			.then((data)=>{
				return new Promise((resolve, reject)=>{
					inFunct(data);
					resolve(data);
				})
			})
			.catch((e)=>{
				console.log("Error in Drew code");
				throw e;
			});	
		});
	}
	addAfterCallback( callbackName:string, f:Function, expects?:object ):Thing{

		if(this.callbacks[callbackName] !== undefined){
			this.afterCallbacks[callbackName] = this.afterCallbacks[callbackName] || [];
			this.afterCallbacks[callbackName].push(f);
		}else{
			throw new Error("callbackName "+callbackName+" not defined. Cannot call 'addAfterCallback'");
		}
		return this;
	}
	setAttribute( attribute:string, state:string ){
		this.attributeTable[attribute]=this.attributeTable[attribute]!==undefined?this.attributeTable[attribute]:{};
		this.attributeTable[attribute]=state;
	}
	getAttribute( attribute:string ):string{
		return this.attributeTable[attribute];
	}
	callAfterCallbacks( state:string ){
		if( this.afterCallbacks[state]!==undefined ){
			for( let i=0; i<this.afterCallbacks[state].length; i++ ){
				this.afterCallbacks[state][i]();
			}
		}
	}
	callCallback_old( state, ...a ){
		console.log("callCallback_old "+state);
		if( this.callbacks[state] !== undefined ){
			// if(){
			// 	this.callbacks[Symbol.toStringTag] === "AsyncFunction" || this.callbacks[Symbol.toStringTag] === 
			// }
			this.state = state;
			return new Promise(( resolve, reject )=>{
				resolve( this.callbacks[state](...a) );

				for( let i=0; i<this.watcherCallbacks[state].length; i++ ){
					let currentCheckingState = this.watcherCallbacks[state][i];
					let shouldCallCallback = true;
					for( let k in currentCheckingState.otherStates ){
						let realState = this.thingsParent.getThing( currentCheckingState.otherStates[k].thing ).getState();
						let testState = currentCheckingState.otherStates[k].state
						if( testState !== realState ){
							console.log("callCallback/"+currentCheckingState.otherStates[k].thing+" didn't pass -- testState "+testState+" -- realState "+realState);
							shouldCallCallback=false;
							break;
						}
					}
					if(shouldCallCallback){console.log("did pass");this.watcherCallbacks[state][i].action();}
				}
			});
		}else{
			throw "No function defined for "+state;
		}
	}
	callCallback( state:string, obj ){
		let objIsArr = Array.isArray(obj);
		if(objIsArr){console.warn("obj is an array...I am working on deprecating this")};

		//console.log("callCallback "+state);
		if( this.callbacks[state] !== undefined ){
			this.state = state;

			let toReturn;

			if(objIsArr){
				toReturn = this.callbacks[state](...obj)
			}else{
				toReturn = this.callbacks[state](obj);
			}

			return toReturn.then(async (data)=>{
				this.callAfterCallbacks(state);
				return data;
			}).catch((err)=>{console.error("thing 112 "+JSON.stringify(err));})

		}else{
			let errTxt = "No function defined for name:"+this.name+" state:"+state;
			console.error(errTxt);
		}
	}
	// addWatcher(state, otherStates, action){
	// 	this.watcherCallbacks[state] = this.watcherCallbacks[state] || [];
	// 	let toPush = {otherStates, action};
	// 	this.watcherCallbacks[state].push( toPush );

	// 	// console.log(this.watcherCallbacks)
	// 	// console.log("^")
	// };
	mergeThing(newThing){
		this.name = newThing.name;
		this.state = newThing.state;
		this.thingsParent = newThing.thingsParent;

		for(let k in newThing.callbacks){
			if(this.callbacks[k] !== undefined){
				let e = new Error(this.name+" callbacks["+k+"] is already taken");
				throw e;
			}
			this.callbacks[k] = newThing.callbacks[k];
		}
		newThing = this;
		return this;
	};
	getState(){
		return this.state;
	};
	setState(newState:string){
		this.state = newState;
		return this.state;
	};
	toObj(){
		let name = this.name;
		let callbacks = Object.keys(this.callbacks);
		let state = this.state;
		return {name, callbacks, state};
		//return "working on it"
	}
}

class Things{

	name: string;
	things: object;
	// callbacks: Array<SecondaryCallback>; // TODO read from the DB the states of devices using the current 

	constructor(name){
		this.name=name;
		this.things = {};
		// this.callbacks = {};
	};
	addThing( thing:Thing ){
		if( this.things[thing.name] === undefined){
			this.things[thing.name] = thing;
		}else{
			this.things[thing.name].mergeThing( this.things[thing.name] );
		}
		return thing;
	};
	addThings( thingsToAdd:Array<Thing> ){
		for(let i=0; i<thingsToAdd.length; i++){
			this.things[ thingsToAdd[i].name ] = thingsToAdd[i];
		}
		return this.things;
	}
	createAddThing( name:string, state?:string ):Thing{
		this.things[name] = new Thing(name, this);
		return this.things[name];
	};
	getThing( name:string ){ // TODO consider not returning the actual object
		if( this.things[name] !== undefined ){
			return this.things[name]
		}else{
			console.error("No thing defined: "+ name);
			return this.things[name]	
		}
	};
	toString(separator:string){
		let arr = [];
		for(var k in  this.things){
			arr.push( this.things[k].toString() );
		}
		return arr.join(separator)
	};
	toObj(){
		let arr = [];
		for(var k in  this.things){
			arr.push( this.things[k].toObj() );
		}
		return (arr);
	}
	// addStateChangeCallback( thingName:string, state:string, callback?:Function ){
	// 	this.callbacks[thingName] = this.callbacks[thingName] || {};
	// 	this.callbacks[thingName][state] = this.callbacks[thingName][state] || [];
	// 	if( callback !== undefined ){
	// 		this.callbacks[thingName][state].push(callback);
	// 	}
	// };
}

export { Things, Thing };