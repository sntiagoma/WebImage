#!/bin/env node
var express = require("express"); //Server
var fs = require("fs"); //Filesystem (read/wrote files)
var path = require("path"); //Path
var mongoose = require("mongoose"); //Mongodb ODM (Object Document Mapper)
var favicon = require('serve-favicon'); ///favicon.ico provider
var sassMiddleware = require("node-sass-middleware"); //Sass compiler
var morgan = require('morgan'); // HTTP request logger
var cookieParser = require("cookie-parser"); //Cookie Manager
var bodyParser = require('body-parser'); //JSON-Raw-Text-URLEncoded body parser
//Routes import
var indexRoute = require("./routes/index");
var apiRoute = require("./routes/api");

var app = express();

//HTTP Logger
app.use(morgan('combined'));

//Cookie Manager
app.use(cookieParser());

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set up server IP address and port # with env
var address = {};
if(process.env.NODEENV=="dev"){
    console.log("Starting in Developing Mode");
    app.locals.pretty = true; //Jade Pretty
    address.ipaddress = "127.0.0.1";
}else{
    console.log("Starting APP");
    address.ipaddress = "127.0.0.1";
}
address.port = 3001;

var terminator = function(sig){
    if (typeof sig === "string") {
       console.log('%s: Received %s - terminating app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
};
var setupTerminationHandlers = function(){
    //  Process on exit and signals.
    process.on('exit', function() {terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
        process.on(element, function() {terminator(element); });
    });
};

setupTerminationHandlers();

//Stylesheets SASS
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/stylesheets/'),
    debug: false,
    outputStyle: 'expanded', //nested, expanded, compact, compressed
    prefix:  '/stylesheets'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//Use public-folder
app.use(express.static(path.join(__dirname, 'public')));

//DB conection
mongoose.connect('mongodb://localhost/webimage');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//View Engine Setup (Jade)
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

//Favicon
app.use(favicon(path.join(__dirname,'public','favicon.ico')));


//Routes
app.use('/',indexRoute);
app.use('/api',apiRoute);
app.use(function(req,res,next){
    var err = new Error('Not Found');
    err.status = 404;
    res.status(err.status).render('error',{error:err});
});

//Start
try{
    app.listen(address.port,address.ipaddress,function(){
        console.log('%s: Node server started on %s:%d ...',
            Date(Date.now()), address.ipaddress, address.port);
    });
}catch(ex){
    address.port = 3002;
    app.listen(address.port,address.ipaddress,function(){
        console.log('%s: Node server started on %s:%d ...',
            Date(Date.now()), address.ipaddress, address.port);
    });
}