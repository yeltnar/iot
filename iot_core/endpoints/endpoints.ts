import {Things, Thing } from "../class/thing";
//import * as express from 'express';
const express = require("express");
//import {exec} from 'child_process';
const {exec} = require("child_process")
const app = express();
const bodyParse = require("body-parser");

let things;
let helpers;

app.use(bodyParse.urlencoded({extended:true}));
app.use(bodyParse.json());

const setDeviceState = function(req, res, next){
	let state = req.params.state;
	let device = req.params.name;
	let params = req.body.params || req.query.params;


	// console.log("typeof req.query")
	// console.log(typeof req.query)
	// console.log(req.query)

	params = helpers.tryToParse(params);

	// console.log("---typeof params")
	// console.log(typeof params)
	// console.log( params)

	console.log("setDeviceState endpoint called");

	things.getThing(device).callCallback(state, params)
	.then((data)=>{
		if( typeof data === "object" ){
			data = JSON.stringify(data);
		}
		res.end(data);
	}).catch((err)=>{
		console.log("endpoints 38 "+JSON.stringify(err));
		res.status(500).send(err);
	})
}

const getEndpoints = function(req, res, next){
	let toPrint = "";
	res.send( things.toString("<br>") );
}

function welcome(req, res){
	res.end("😀 Welcome! 😀")
}

function legacyError(req, res){
	res.status(500).send('Legacy format not supported!');
}

app.get ('/set/:name/:state', setDeviceState);
app.post ('/set/:name/:state', setDeviceState);
app.get ('/endpoints', getEndpoints);
app.post ('/endpoints', getEndpoints);
app.get ('/', welcome);
app.post ('/', welcome);

//error with legacy
app.get("/json*",legacyError);
app.post("/json*",legacyError);
app.get("/slash*",legacyError);
app.post("/slash*",legacyError);
app.get("/send*",legacyError);
app.post("/send*",legacyError);

export function endpointsInit( config, inThings:Things, inHelpers){
	try{
		let port = config.port
		things = inThings;
		helpers = inHelpers;
		app.listen(port, () => console.log('Listening on port '+port+'!'));	
	}catch(e){console.error(e);console.log("failed to call endpointsInit")}
}