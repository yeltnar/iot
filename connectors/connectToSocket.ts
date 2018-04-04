import {Things, Thing} from "../class/thing";
const WebSocket = require('ws');

function connectToSocketInit(socketConfig, things:Things){

	let id_obj = {
        'group':'home_pi',
        'userType':"node"
    }
 
 	let ws;
 	try{
		ws = new WebSocket(socketConfig.url);
	}catch(e){
		console.log("server connection failed");
		setTimeout(connectToSocketInit(socketConfig, things),socketConfig.retryFrequency);
	}
	 
	ws.on('open', function open() {
		let group = id_obj.group;
		let userType = id_obj.userType;
		let obj = {'cmd': 'connected', group, userType}

	  	ws.send( JSON.stringify(id_obj) );
	  	console.log("socket open")
	});

	ws.on('ping',(data)=>{
		console.log(data.toString());
	})
	 
	ws.on('message', function incoming(data) {
		if( data.indexOf("Welcome, new ")<0 && data.indexOf("//no_action_info")<0 ){
			try{
				console.log("data is "+data);
				data = JSON.parse(data);
				let {message, uid} = data;
				let {thing, callback, params} = message;

				if( thing!==undefined && callback!==undefined ){
					console.log("thing "+thing)
					console.log("callback "+callback)
					console.log("params "+params)
					things.getThing(thing).callCallback(callback, params)
					.then((data)=>{
						let obj = {
							"data":data,
							uid
						};
						let toSend = JSON.stringify(obj)
						ws.send(toSend);
						console.log("callback  44 "+typeof toSend);
						console.log("callback  45 "+toSend);
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