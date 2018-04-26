const WebSocket = require('ws');
const config = require('config');
const requestP = require("request-promise-native");

function connectToSocketInit(socketConfig){

	console.log("socketConfig is "+JSON.stringify(socketConfig));

	try{

		let id_obj = {
	        'group':'home_pi',
	        'userType':"node"
	    }
	 
	 	let ws;
	 	try{
			ws = new WebSocket(socketConfig.url);
		}catch(e){
			console.log("server connection failed");
			setTimeout( ()=>{connectToSocketInit(socketConfig)}, socketConfig.retryFrequency );
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

					let port = data.body.port || data.query.port || socketConfig.default_http_port;
					port = port===""?"":":"+port;

					let host = data.body.request_host || data.query.request_host || socketConfig.default_http_host;
					data.host = host;

					if(port!==undefined&&port!=""&&port!=="undefined"){
						host = host+port;
						console.log("changed host "+host);
					}

					let obj = {
						"method":data.method,
						"uri":host+data.path
					}

					// TODO check if other methods don't have body
					if( data.body!==undefined && data.body!=={} && data.method.toLowerCase() !== "get" ){
						if( typeof data.body === "object" ){
							// console.log("------> data.body")
							// console.log(data.body)
							obj.body = (data.body);
							obj.json = true;
						}else{
							obj.body = data.body;
						}
					}
					if(data.query!==undefined && data.query!=={}){
						if( typeof data.query === "object" ){
							// console.log("------> data.query")
							// console.log(data.query)
							obj.qs=(data.query);
						}else{
							obj.qs=data.query;	
						}
					}
					// TODO add any more?

					console.log("obj")
					console.log(obj)

					if(data.legacy===true){
						let title = "Legacy request!";
						let ip = data.ip;
						let path = data.path;

						var options = { 
							method: 'GET',
						  	url: 'http://127.0.0.1:3001/set/notification/notify',
						  	qs:{ 
						   		group: 'home_pi',
						     	port: '3001',
						     	params:`{"title":"${title}","message":"source IP ${ip} path ${path}"}`
						     } 
						 };

						requestP(options).catch((e)=>{console.error(e)}) // TODO make this a module

					}

					requestP(obj)
					.then((responseData)=>{

						let sendToSocket = {
							"message":responseData,
							"uid":data.uid
						}

						console.log("sending")
						console.log((sendToSocket))
						console.log(JSON.stringify(sendToSocket))
						ws.send(JSON.stringify(sendToSocket));

					}).catch((error)=>{
						let newData = {error, "uid":data.uid}
						let title = "ERROR sending request";
						let ip = data.ip;
						let path = data.path;

						var options = { 
							method: 'GET',
						  	url: 'http://127.0.0.1:3001/set/notification/notify',
						  	qs:{ 
						   		group: 'home_pi',
						     	port: '3001',
						     	params:`{"title":"${title}","message":"source IP ${ip} path ${path}"}`
						     } 
						 };

						console.log("options is "+JSON.stringify(options));
						requestP(options).catch((e)=>{console.error(e)}) // TODO make this a module
						console.error("ERROR sending "+JSON.stringify(obj));
						ws.send(JSON.stringify(newData));

					});
					
				}catch(error){
					data = {error, "uid":data.uid}
					console.error("ERROR sending "+JSON.stringify(data));
					ws.send(JSON.stringify(data));
				}
			}else{
				console.log(data);
			}
		});

		ws.on('close', function(data){
			console.log("socket closed "+data+" - "+(new Date()).toString());
			connectToSocketInit(socketConfig);
		});
	}catch(e){console.error(e);console.log("failed to call connectToSocketInit")}
}

connectToSocketInit(config.socket);
