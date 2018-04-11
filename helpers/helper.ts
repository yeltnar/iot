import {schedulerInit} from "../helpers/scheduler";
const {exec} = require("child_process")

function helpersInit(config){
	let helpers;
	try{
		helpers = {

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
			weather:{},
			ScheduleHolder:schedulerInit(config.scheduler)
		};
	}catch(e){console.error(e);console.error("failed to run helpersInit");}
	return helpers;
}

export {helpersInit}