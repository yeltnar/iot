// https://www.reddit.com/search.json?q=sort=top&subreddit=earthporn&limit=15&t=day

// https://www.reddit.com/search.json?q=subreddit:earthporn&sort=top&subreddit=earthporn&limit=15&t=day

const requestP = require("request-promise-native");

async function search(subreddit, sort="top", limit, t){
	if( subreddit===undefined ){ throw new Error("subreddit is required for reddit.search"); }

	let options={
		"qs":{
			"q":"subreddit:"+subreddit,
			sort,
			subreddit,
			limit,
			t
		},
		"method":"GET",
		"url":"https://www.reddit.com/search.json"

	};

	return requestP(options).then((data)=>{return JSON.parse(data)})
}

function redditInit(){
	return {search};
}

export{redditInit}