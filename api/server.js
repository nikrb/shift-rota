// FIXME: es6?
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require( 'multer');
var upload = multer({ dest: './client/pdfs'});
var parseRota = require( './pdfRotaParser');

var app = express();

app.set('port', (process.env.PORT || 8080));

app.use('/', express.static(path.join(__dirname, '../dist')));

app.post( '/api/upload', upload.single( 'pdf'), function( req, res){
  let ret = "file type not supported";
  console.log( "@POST api/upload filepath:", req.file.path);
  const filename = req.file.originalname;
  const ext = filename.substr(filename.lastIndexOf('.')+1);
  if( ext === "pdf"){
    ret = "ok";
    parseRota( req.file.path);
  }
  res.end( ret);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

require( './routes.js')(app);

app.listen(app.get('port'), function() {
  console.log('Server started: https://localhost:' + app.get('port') + '/');
});
