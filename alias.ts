const {exec} = require("child_process")

function aliasInit( things, hueFunc, helpers ){

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

			let timeout = params[0] || 1000*60*3;
			console.log("timeout is "+(timeout/1000/60)+" min");

			let arr = [];
			arr.push( things.getThing("living_room_light").callCallback("on") );
			arr.push( things.getThing("bedroom_light").callCallback("on") );
			arr.push( new Promise((reslove2, reject2)=>{ setTimeout(()=>{reslove2();}, timeout) }) )

			Promise.all(arr).then((resolve2, reject2)=>{
				let arr = [];
				arr.push( things.getThing("living_room_light").callCallback("off") );
				arr.push( things.getThing("bedroom_light").callCallback("off") );
				Promise.all(arr)
				.then( things.getThing("notification").callCallback("notify", "lights off timeout", "done") )
				.then(()=>{resolve()});
			});
		});
	});
	alias.addCallback("lights_on_for_ms", (...params)=>{
		return new Promise((resolve, reject)=>{

			let timeout = params[0] || 1000;
			console.log("timeout is "+(timeout/1000/60)+" min");

			let arr = [];
			arr.push( things.getThing("living_room_light").callCallback("on") );
			arr.push( things.getThing("bedroom_light").callCallback("on") );
			arr.push( new Promise((reslove2, reject2)=>{ setTimeout(()=>{reslove2();}, timeout) }) )

			Promise.all(arr).then((resolve2, reject2)=>{
				let arr = [];
				arr.push( things.getThing("living_room_light").callCallback("off") );
				arr.push( things.getThing("bedroom_light").callCallback("off") );
				
				Promise.all(arr)
				.then(()=>{resolve()});
			});
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
			resolve(this.count); 
		});
	});
	alias.addCallback("update", ()=>{
		return new Promise((resolve, reject)=>{
			exec("git pull",(err, stdout, stderr)=>{
				console.log("about to restart");
				console.log(stdout);
				resolve( 'exiting app '+stdout );
				exec("tsc app.ts --outDir outdir",(err, stdout, stderr)=>{
					exec("pm2 restart all",(err, stdout, stderr)=>{});
				});
			});
		});
	});
	alias.addCallback("flash_3_times",(...params)=>{
		return things.getThing("alias").callCallback("flash_n_times",[3]);
	})
	alias.addCallback("flash_n_times",(...params)=>{

		return new Promise((resolve, reject)=>{

			let numberOfTimes = params[0] || 3;
				
			console.log("flash_"+numberOfTimes+"_times");

			async function flashNTimes(lightNumber, numberOfTimes){

				let state = await hueFunc.getLightState(lightNumber); // bool value of state
				let timeSpacer = 1000;

				for(let i=0; i<numberOfTimes; i++){

					await hueFunc.setLightState(lightNumber, !state);
					await helpers.timeoutPromise(timeSpacer);
					await hueFunc.setLightState(lightNumber, state);
					await helpers.timeoutPromise(timeSpacer);

				}
				
				// await helpers.timeoutPromise(timeSpacer);
				// hueFunc.setLightState(lightNumber,state)

				return "done";
			}

			let pArr = [flashNTimes(1,numberOfTimes)];

			// for(let i=0; i<2; i++){
			// 	pArr.push( flashNTimes(i+1,numberOfTimes) );
			// }

			Promise.all( pArr ) // TODO get all lights, mebe?
			.then(()=>{
				resolve();
			})
		
		});
	});
}

export {aliasInit};