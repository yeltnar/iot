import {schedulerInit} from "../helpers/scheduler";
import {redditInit} from "../helpers/reddit";
const fs = require("fs");
const {exec, execFile} = require("child_process")

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


					exec(command, (err, stdout, stderr)=>{
						if(err){
							console.error(err)
							console.error(command+" failed exec err")
							return reject(err);
						}else if(stderr){
							console.log(command+" failed stderr "+stderr)
							return resolve(stderr);
						}else{
							console.log(command+" success "+stdout)
							return resolve(stdout);
						}
					});
				})
			},
			execPromiseFile:(file)=>{
				return new Promise((resolve, reject)=>{

					execFile(file, (err, stdout, stderr)=>{
						if(err){
							console.error(err)
							console.log(file+" failed exec err")
							return reject(err);
						}else if(stderr){
							console.log(file+" failed stderr "+stderr)
							return resolve(stderr);
						}else{
							console.log(file+" success "+stdout)
							return resolve(stdout);
						}
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
			fsPromise:{
				readFile:(path, options)=>{
					console.log("read file")
					return new Promise((resolve, reject)=>{
						fs.readFile(path, options, (err, data)=>{
							if(err){return reject(data);}
							resolve(data);
						});
					});
				},
				writeFile:(path, data, options)=>{
					return new Promise((resolve, reject)=>{
						fs.writeFile(path, data, options, (err)=>{
							if(err){return reject(data);}
							resolve();
						})
					})
				}
			},
			weather:{},
			ScheduleHolder:schedulerInit(config.scheduler),
			reddit:redditInit(config.reddit)
		};
	}catch(e){console.error(e);console.error("failed to run helpersInit");}
	return helpers;
}

export {helpersInit}