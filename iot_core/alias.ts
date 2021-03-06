const {exec} = require("child_process")

function aliasInit( things, hueFunc, helpers ){

	try{

		let alias = things.createAddThing("alias")
	
		alias.addCallback("arriving", ()=>{
			let arr = [];
			arr.push( things.getThing("desk_socket").callCallback("on") );
			arr.push( things.getThing("living_room_light").callCallback("on") );
			//arr.push( things.getThing("bedroom_light").callCallback("on") );
			return Promise.all(arr);
		});
		alias.addCallback("leaving", ()=>{
			let arr = [];
			arr.push( things.getThing("desk_socket").callCallback("off") );
			arr.push( things.getThing("living_room_light").callCallback("off") );
			arr.push( things.getThing("bedroom_light").callCallback("off") );
			return Promise.all(arr);
		});
		alias.addCallback("bedtime", ()=>{
			let arr = [];
			arr.push( things.getThing("desk_socket").callCallback("off") );
			arr.push( things.getThing("living_room_light").callCallback("off") );

			arr.push( things.getThing("bedroom_light").callCallback("on").then((resolve, reject)=>{
				setTimeout(()=>{
					things.getThing("bedroom_light").callCallback("off").then(()=>{
						resolve()
					})
				},1000*10*60);
			}) );
			return Promise.all(arr);
		});
		alias.addCallback("about_to_leave", (...params)=>{
			//console.log("///about to leave");

			return new Promise((resolve, reject)=>{
				(async ()=>{

					let timeout = params[0] || 1000*60*3;
					console.log("timeout is "+(timeout/1000/60)+" min");

					things.getThing("living_room_light").callCallback("on");
					things.getThing("bedroom_light").callCallback("on");
					await helpers.timeoutPromise(timeout);

					await things.getThing("bedroom_light").callCallback("off");
					await things.getThing("notification").callCallback("notify", "lights off timeout", timeout+" ms is done");
					resolve();
				})();
			});
			
		});
		alias.addCallback("lights_on_for_ms", (...params)=>{
			return new Promise(async (resolve, reject)=>{
				
				let timeout = params[0] || 1000;
				console.log("timeout is "+(timeout/1000/60)+" min");

				things.getThing("living_room_light").callCallback("on")
				things.getThing("bedroom_light").callCallback("on");
				await helpers.timeoutPromise(timeout);
				resolve("Lights on. Turnning off in "+(timeout/1000/60)+" min");

				things.getThing("living_room_light").callCallback("off");
				await things.getThing("bedroom_light").callCallback("off");
				things.getThing("notification").callCallback("notify", ["lights_on_for_ms done", timeout]);
				
			});
		});
		alias.addCallback("move_to_livingroom", ()=>{
			let arr = [];
			arr.push( things.getThing("living_room_light").callCallback("on") );
			arr.push( things.getThing("bedroom_light").callCallback("off") );
			return Promise.all(arr);
		});
		alias.addCallback("move_to_bed_room", ()=>{
			let arr = [];
			arr.push( things.getThing("bedroom_light").callCallback("on") );
			arr.push( things.getThing("living_room_light").callCallback("off") );
			return Promise.all(arr);
		});
		alias.addCallback("count", ()=>{

			this.count = this.count || 0;
			this.count++;

			return new Promise((resolve, reject)=>{
				resolve(this.count+""); 
			});
		});
		alias.addCallback("update", ()=>{
			return new Promise((resolve, reject)=>{
				let toResolve="";
				exec("git pull",(err, stdout, stderr)=>{
					console.log("about to restart");
					console.log(stdout);
					toResolve+=stdout;
					exec("npm i",(err, stdout, stderr)=>{
					toResolve+="\n"+stdout;
					resolve( 'exiting app '+stdout );
						exec("tsc app.ts --outDir outdir",(err, stdout, stderr)=>{
							toResolve+="\n"+stdout;
							resolve( 'exiting app '+stdout );
							exec("pm2 restart all",(err, stdout, stderr)=>{});
						});
					});
				});

				// return

				// let toResolve="";
				// toResolve += await helpers.execPromise("git pull")+"\n";
				// toResolve += await helpers.execPromise("tsc app.ts --outDir outdir");
				// toResolve +="restarting with pm2...";
				// resolve(toResolve);
				// helpers.execPromise("pm2 restart all");

			});
		});
		alias.addCallback("flash_3_times",async (...params)=>{
			return things.getThing("alias").callCallback("flash_n_times",[3]);
		})
		alias.addCallback("flash_n_times",(...params)=>{

			return new Promise((resolve, reject)=>{

				let numberOfTimes = params[0] || 3;
					
				console.log("flash_"+numberOfTimes+"_times");

				async function flashNTimes(lightNumber, numberOfTimes){

					let state = await hueFunc.getLightState(lightNumber); // bool value of state
					let timeSpacer = 1000;

					if( lightNumber!==2 || state ){

						for(let i=0; i<numberOfTimes; i++){

							await hueFunc.setLightState(lightNumber, !state);
							await helpers.timeoutPromise(timeSpacer);
							await hueFunc.setLightState(lightNumber, state);
							await helpers.timeoutPromise(timeSpacer);

						}

					}
					
					// await helpers.timeoutPromise(timeSpacer);
					// hueFunc.setLightState(lightNumber,state)

					return "done";
				}

				let pArr = [];

				for(let i=1; i<=2; i++){				
					pArr.push( flashNTimes(i,numberOfTimes) );
				}

				Promise.all( pArr ) // TODO get all lights, mebe?
				.then(()=>{
					resolve();
				})
				.catch((err)=>{
					reject(err);
				})
			
			});
		});
		alias.addCallback("slack_flash",(...params)=>{

				let numberOfTimes = params[0] || 3;
				return things.getThing("alias").callCallback("flash_n_times",[numberOfTimes]);
		});

		alias.addCallback("version", ()=>{
			return helpers.execPromise("git rev-parse HEAD");
		})

		alias.addCallback("test", async (params)=>{
			
			console.log("test function called with params...");
			console.log(params);
			return "done";
			// return new Promise((resolve, reject)=>{
			// 	resolve("done")
			// })
		})

	}catch(e){console.error(e);console.log("failed to call aliasInit")}

	return things;
}

export {aliasInit};