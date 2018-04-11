// class wrapper around node-scheduler with ability to get previously scheduled tasks by a name
const nodeSchedule = require('node-schedule');
let schedulerConfig;

class ScheduleHolder{
	schedulerConfig:object;
	scheduleTable:object={};
	schedule:object = nodeSchedule;

	constructor(schedulerConfig){
		this.schedulerConfig = schedulerConfig;
	};
	addEvent(schedule, callback:Function, name:string){



		if(this.scheduleTable[name]===undefined){
			this.scheduleTable[name] = new ScheduleEvent(schedule, callback, name);
		}else{
			throw new Error("Schedule event already exsists");
		}
		console.log("Scheduled "+name+". Next run is "+this.scheduleTable[name].nextInvocation());
	}
	getEvent(name:string):ScheduleEvent{
		if(this.scheduleTable[name]!==undefined){
			return this.scheduleTable[name].event;
		}
	}
}

class ScheduleEvent{
	name:string;
	callback:Function;
	event:object;

	constructor(schedule, callback:Function, name:string){
		// TODO add to database or txt file
		this.name = name;
		this.callback = callback;
		this.event = nodeSchedule.scheduleJob(schedule,callback);
		return this;
	};
	nextInvocation(){
		return this.event.nextInvocation();
	}
	cancel(reshedule?){
		return this.event.cancel(reshedule);
	}
	cancelNext(reshedule?){
		return this.event.cancelNext(reshedule);
	}
}

function schedulerInit(schedulerConfig:object):ScheduleHolder{
	let ScheduleHolderInstance;
	let nodeSchedule;

	try{ 
		ScheduleHolderInstance=new ScheduleHolder(schedulerConfig); 
		nodeSchedule = nodeSchedule;
	}catch(e){console.error(e);console.error("failed to load schedulerInit");}

	return ScheduleHolderInstance;
}

export {schedulerInit};