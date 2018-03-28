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
	scheduleAction:( time:Date, action:function, repeat:boolean=false )=>{

	}
};

export {helpers}