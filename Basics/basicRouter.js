'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');

let routes = {
	'GET': {
		'/': (req, res)=>{
			res.writeHead(200, {'Content-type':'text/html'});
			res.end("<h1>Hello Router</h1>");
		},
		'/about': (req,res)=>{
			res.writeHead(200, {'Content-type':'text/html'});
			res.end("<h1>Hello About Page</h1>");
		},
		'/api/getinfo': (req, res) => {
			res.writeHead(200, {'Content-type': 'application/json'});
			res.end(JSON.stringify(req.queryParams));
		}
	},
	'POST': {
		'/api/login': (req, res) => {
			let body = '';
			req.on('data', data=>{
				body += data;
				if(body.length>997151){
					res.writeHead(413, {'Content-type':'text/html'});
					res.end("<h3>File being uploaded exceeds 1mb limit</h3>");
					req.connection.destroy();
				}
			});

			req.on('end', ()=>{
				let params = qs.parse(body);
				console.log("Username: ", params['username']);
				console.log("Password: ", params['password']);
				res.end();
			});
		}
	},
	'NA': (req, res)=>{
		res.writeHead(404);
		res.end("Content Not Found");
	}
};

function router(req,res){
	let baseURI = url.parse(req.url, true);
	let resolveRoute = routes[req.method][baseURI.pathname];
	if(resolveRoute != undefined){
		req.queryParams = baseURI.query;
		resolveRoute(req, res);
	}else{
		routes['NA'](req,res);
	}
};

http.createServer(router).listen(3000, ()=>{
	console.log("Server Running on port 3000");
});