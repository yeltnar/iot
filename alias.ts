const {exec} = require("child_process")

function aliasInit( things ){

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
		arr.push( things.getThing("bedroom_light").callCallback("off") );
		return Promise.all(arr);
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
				resolve( 'exiting app '+stdout );
				exec("tsc app.ts outdir",(err, stdout, stderr)=>{
					setTimeout(()=>{ exec("pm2 restart all",(err, stdout, stderr)=>{}); },4000)
				});
			});
		});
	});
}

export {aliasInit};