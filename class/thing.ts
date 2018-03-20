let requestP = require('request-promise-native');

class Thing{

	state: string;
	name: string;
	callbacks: object;
	thingsParent: Things;
	watcherCallbacks: object;

	constructor(name:string, thingsParent:Things){
		this.thingsParent = thingsParent;
		this.callbacks = {};
		this.name = name;
		this.watcherCallbacks = {};
		thingsParent.addThing(this);
	}
	toString(thingSep="\n", keySep=" "){
		return "Name:"+this.name+";"+keySep+"State:"+this.state+";"+keySep+"Callbacks:"+JSON.stringify(Object.keys(this.callbacks))+keySep+"Parent name:"+this.thingsParent.name;
	}
	addCallback( state:string, f:Function ){
		if( this.callbacks[state] === undefined){
			// this.thingsParent.addStateChangeCallback( this.name, state ); // sets it up if not
			this.callbacks[state] = f;
		}else{
			throw "'"+state+"' has already been set for "+this.name;
		}
	}
	addUrlCallback( name:string, options:object, inFunct=(data)=>{} ){
		this.addCallback(name, ()=>{

			return requestP( options ).then((data)=>{
				inFunct(data);
			}).catch((e)=>{
				console.log("Error in Drew code");
				throw e;
			});	
		});
	}
	callCallback( state, ...a ){
		if( this.callbacks[state] !== undefined ){
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
	addWatcher(state, otherStates, action){
		this.watcherCallbacks[state] = this.watcherCallbacks[state] || [];
		let toPush = {otherStates, action};
		this.watcherCallbacks[state].push( toPush );

		// console.log(this.watcherCallbacks)
		// console.log("^")
	};
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
	createAddThing( name:string, state?:string ){
		this.things[name] = new Thing(name, this);
		return this.things[name];
	};
	getThing( name:string ){ // TODO consider not returning the actual object
		return this.things[name];
	};
	toString(separator:string){
		let arr = [];
		for(var k in  this.things){
			arr.push( this.things[k].toString() );
		}
		return arr.join(separator)
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