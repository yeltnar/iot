const {exec} = require("child_process")

let helpers = {

	timeoutPromise:(timeout)=>{
		return new Promise((resolve, reject)=>{
			setTimeout( resolve, timeout );
		});
	},
	execPromise:(command)=>{
		return new Promise((resolve, reject)=>{

			exec(command, (err, stdout, stderr)=>{
				if(err){
					return reject(err);
				}else if(stderr){
					return reject(stderr);
				}
				return resolve(stdout);
			});
		})
	}

};

export {helpers}