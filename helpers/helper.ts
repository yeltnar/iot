let helpers = {

	timeoutPromise:(timeout)=>{
		return new Promise((resolve, reject)=>{
			setTimeout( resolve, timeout );
		});
	}

};

export {helpers}