'use strict'
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
let mimes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png'
};

function webServer(req,res){
  //if the route requested is '/', then serve index.htm file or else
  // load the requested file
  let baseURI = url.parse(req.url);
  let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
  
  //fs.F_OK will check if requested file is accessible
  fs.access(filepath, fs.F_OK, error=>{
    if(!error){
      //read and serve the file over response
      fs.readFile(filepath, (error, content)=>{
        if(!error){
          console.log("Serving: ", filepath);
          //resolve content type of the file
          let contentType = mimes[path.extname(filepath)]; //mimes ['.css'] === 'text/css'
          
          //serve file from the buffer
          res.writeHead(200, {'Content-type': contentType});
          res.end(content, 'utf-8');
          
          
        }else{
          //serve a 500 error, 
          res.writeHead(500);
          res.end("Server could not read the file requested.");
        }
      });
    }else{
      //serve a 404 error
      res.writeHead(404);
      res.end("Content not found");
    }
  });
  
  
}

http.createServer(webServer).listen(3000, ()=>{
  console.log("Server Running!")
});