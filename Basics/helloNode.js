'use strict'
const http = require('http');

http
	.createServer((req,res) => {
		res.writeHead(200, {'Content-type': 'text/html'});
		res.end("<h1>Hello World</h1>")
	})
	.listen(8080, () => {
		console.log("Server is Running");
	});