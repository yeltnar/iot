import {Things, Thing} from "../class/thing";
const WebSocket = require('ws');

function connectToSocketInit(socketConfig, things:Things){
 
 	try{
		const ws = new WebSocket(socketConfig.url);
	}catch(e){
		console.log("server connection failed");
		setTimeout(connectToSocketInit(socketConfig, things),socketConfig.retryFrequency);
	}
	 
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
		if( data.indexOf("Welcome, new ")<0 && data.indexOf("//no_action_info")<0 ){
			try{
				console.log("data is "+data);
				data = JSON.parse(data);
				let {message, params, uid} = data;
				let {thing, callback} = message;

				if( thing!==undefined && callback!==undefined ){
					console.log("thing "+thing)
					console.log("callback "+callback)
					things.getThing(thing).callCallback(callback, ...params)
					.then((data)=>{
						let obj = {
							"data":data,
							uid
						};
						ws.send(JSON.stringify(obj));
						console.log("callback  40 "+JSON.stringify(obj));
					});
				}
			}catch(e){
				console.error(e);
				console.log("***"+data+"***");
			}
		}else{
			console.log(data);
		}
	});

	ws.on('close', function(data){
		console.log("\n\n\nsocket closed "+data+" - "+(new Date()).toString());
		connectToSocketInit(socketConfig, things);
	});

}

export {connectToSocketInit}