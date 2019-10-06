const express = require('express');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 8080;
const app = express();
const mimeTypes = require('mime-types')

const NodeCache = require( "node-cache" );
const cache = new NodeCache();


function readFromDisk(filepath) {
  if( !fs.existsSync(filepath) ) {
    console.log("NotFound: " + filepath)
    throw 'NotFound';
  }

  return fs.readFileSync(filepath);
}

function readCached(filepath) {
  var content = cache.get(filepath);

  if( !content ) {
    console.log("Caching: " + filepath)
    content = readFromDisk(filepath);
    cache.set(filepath, content);
  }

  return content;
}


function sendContent(res, headers, content) {
  res.status(200).set(headers).send(content).end();
}

function sendServerError(res) {
  res.status(500).set({'Content-Type': 'text/html'}).send("Please try again in some time").end();
}

function sendNotFound(res) {
  res.status(404).set({'Content-Type': 'text/html'}).send("Cannot find file").end();
}


function tryRequestedResource(req, res, originalFilepath, contentType) {
  try {
    sendContent(res, { 'Content-Type': contentType }, readCached(originalFilepath));
  } catch ( nerr ) {
    if( nerr == 'NotFound' ) {
      sendNotFound(res);
    }
  }
}

function tryCompressedResource(req, res, originalFilepath, contentType) {
  var bestEncoding = getBestAcceptedEncoding(req);
  var encodedFilepath = originalFilepath + bestEncoding.extension;

  try {
    var headers = {'Content-Type': contentType, 'Content-Encoding': bestEncoding.encoding};
    sendContent(res, headers, readCached(encodedFilepath));
  } catch ( err ) {
    tryRequestedResource(req, res, originalFilepath, contentType);
  }
}


function getBestAcceptedEncoding(req) {
  var acceptedEncoding = req.header("accept-encoding");

  if( !acceptedEncoding ) {
    return {encoding: "identity", extension: ""};
  }

  var hasBr = false, hasGz = false;
  for( encoding of acceptedEncoding.split(',') ) {
      hasBr = hasBr || encoding.includes("br");
      hasGz = hasGz || encoding.includes("gzip");
  }

  if( hasBr ) { return {encoding: "br", extension: ".br"}; }
  if( hasGz ) { return {encoding: "gzip", extension: ".gz"}; }
  return {encoding: "identity", extension: ""};
}


app.get('/cv', function(req, res, next) {
  var filepath = __dirname + '/dist/cv.pdf';
  //res.download(filepath, "DivyanshuVerma1.pdf");

  res.setHeader('Content-Disposition', 'inline; filename=Divyanshu Verma [divyanshuverma.in].pdf');
  tryRequestedResource(req, res, filepath, "application/pdf");
});


app.use( function( req, res, next ) {
  var filepath = __dirname + '/dist' + req.url;
  if( req.url == '/' ) {
    filepath = filepath + 'index.html';
  }

  var extname = String(path.extname(filepath)).toLowerCase();
  var contentType = mimeTypes.lookup(extname);

  if( contentType.startsWith("image") ) {
    tryRequestedResource(req, res, filepath, contentType);
    return;
  }

  tryCompressedResource(req, res, filepath, contentType);
});

app.listen(port);
console.log('Server up at port ' + port)