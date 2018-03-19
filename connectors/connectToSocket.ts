import {Things, Thing} from "../class/thing";
const WebSocket = require('ws');

function connectToSocketInit(socketConfig, things:Things){
 
	const ws = new WebSocket(socketConfig.url);
	 
	ws.on('open', function open() {

		let obj = {
	        'cmd': 'connected',
	        'group':'home_pi',
	        'userType':"node"
	    }
	  	ws.send( JSON.stringify(obj) );
	  	console.log("socket open")
	});
	 
	ws.on('message', function incoming(data) {
		if( data.indexOf("Welcome, new ")<0 ){
			try{
				data = JSON.parse(data);
				let {thing, callback, params} = data;

				if( thing!==undefined && callback!==undefined ){
					if( params!==undefined ){
						things.getThing(thing).callCallback(callback, ...params);
					}else{
						things.getThing(thing).callCallback(callback);	
					}
				}
			}catch(e){
				console.error(e);
				console.log(data);
			}
		}else{
			console.log(data);
		}
	});

}

export {connectToSocketInit}