
function keepBluemixAliveInit(things, helpers){

	let hour = parseInt(Math.random() * 3)+2; // dfaq, syntax checking? 2-4
	let minute = parseInt(Math.random() * 60); // dfaq, syntax checking? 0-59
	let second = parseInt(Math.random() * 60); // dfaq, syntax checking? 0-59
	
	helpers.ScheduleHolder.addEvent({hour, minute, second},keep_bm_alive,"keep_bm_alive");

	async function keep_bm_alive(){

		try{
			await helpers.execPromise("chmod 700 iot_core/helpers/keep_bm_alive.sh");
			await helpers.execPromiseFile("iot_core/helpers/keep_bm_alive.sh");
			console.log("successfully keeping bm alive");
			return "successfully keeping bm alive";
		}catch(e){
			console.error(e);
		}

	}
	keep_bm_alive();
}

export {keepBluemixAliveInit}