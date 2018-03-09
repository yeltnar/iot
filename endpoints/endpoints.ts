import {Things, Thing } from "../class/thing";
//import * as express from 'express';
const express = require("express");
//import {exec} from 'child_process';
const {exec} = require("child_process")
const app = express();
const bodyParse = require("body-parser");

let things = new Things();

app.use(bodyParse.urlencoded({extended:true}));
app.use(bodyParse.json());

const jsonEndPoint = function(req, res, next){
	let data = req.body !== undefined ? req.body : req.query;
	res.send( JSON.stringify(req.query) );
}

const rootEndPoint = function(req, res, next){
	res.send( 'Hello World!' );
}

const exitAndUpdate = function(req, res, next){
	exec("git pull",(err, stdout, stderr)=>{
		res.send( 'exiting app '+stdout );
		exec("pm2 restart all",(err, stdout, stderr)=>{});
	});
}

const setDeviceState = function(req, res, next){
	let state = req.params.state;
	let device = req.params.name;

	let params = req.body.params || [];

	let pro = things.getThing(device).callCallback(state, ...params)

	//"[object Promise]"
	console.log( Object.prototype.toString.call(pro) );


	pro.then((data)=>{
		res.end("data is "+data);
	});
}

const getEndpoints = function(req, res, next){
	let toPrint = "";
	res.send( things.toString("<br>") );
}

app.get('/', rootEndPoint);
app.post('/json', jsonEndPoint);
app.get ('/json', jsonEndPoint);
app.get ('/update', exitAndUpdate);

app.get ('/set/:name/:state', setDeviceState);
app.post ('/set/:name/:state', setDeviceState);
app.get ('/endpoints', getEndpoints);
app.post ('/endpoints', getEndpoints);

export function endpointsInit( config, inThings:Things ){
	let port = config.port
	things = inThings;
	app.listen(port, () => console.log('Listening on port '+port+'!'));	
}