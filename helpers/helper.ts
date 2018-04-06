const {exec} = require("child_process")

let helpers = {

	timeoutPromise:(timeout)=>{
		return new Promise((resolve, reject)=>{
			setTimeout( resolve, timeout );
		});
	},
	execPromise:(command)=>{
		return new Promise((resolve, reject)=>{

			console.log(command)

			exec(command, (err, stdout, stderr)=>{
				if(err){
					console.error(err)
					return reject(err);
				}else if(stderr){
					console.error(stderr)
					return reject(stderr);
				}
				console.log(stdout)
				return resolve(stdout);
			});
		})
	},
	scheduleAction:( timeObj, action:Function, repeat:boolean=false )=>{
		if(timeObj.hr === undefined || timeObj.min === undefined){throw new Error("must define timeObj.min and timeObj.hr");}

		console.log("scheduling "+JSON.stringify(timeObj));

		let now = new Date();
		let then = new Date();
		then.setHours(timeObj.hr);
		then.setMinutes(timeObj.min);
		then.setSeconds(0);
		then.setMilliseconds(0);

		if( then<now ){
			let day = then.getDate();
			then.setDate(day+1);
		}

		let timeout = then.getTime()-now.getTime();

		setTimeout(()=>{
			action();
			if( repeat ){
				helpers.scheduleAction(timeObj, action);
			}
		}, timeout);
		console.log(then.toString());
		console.log(timeout);
	},
	tryToParse:(data)=>{
		try{
			data = JSON.parse(data);
		}catch(e){}
		return data;
	}, 
	tryToParsePromise:(data)=>{
		return new Promise((resolve, reject)=>{
			resolve(helpers.tryToParse(data));
		});
	},
	weather:{}
};

export {helpers}