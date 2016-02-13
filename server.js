#!/bin/env node
var express        = require("express"); //Server
var fs             = require("fs"); //Filesystem (read/wrote files)
var path           = require("path"); //Path
var mongoose       = require("mongoose"); //Mongodb ODM (Object Document Mapper)
var favicon        = require("serve-favicon"); ///favicon.ico provider
var morgan         = require("morgan"); // HTTP request logger
var cookieParser   = require("cookie-parser"); //Cookie Manager
var bodyParser     = require("body-parser"); //JSON-Raw-Text-URLEncoded body parser
var Log            = require("log"), log = new Log("info");
// Log Levels
// 0 EMERGENCY system is unusable
// 1 ALERT action must be taken immediately
// 2 CRITICAL the system is in critical condition
// 3 ERROR error condition
// 4 WARNING warning condition
// 5 NOTICE a normal but significant condition
// 6 INFO a purely informational message
// 7 DEBUG messages to debug an application

//Routes import
var indexRoute = require("./routes/index");
var apiRoute = require("./routes/api");

var app = express();

//HTTP Logger
app.use(morgan("combined"));

//Cookie Manager
app.use(cookieParser());

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set up server IP address and port # with env
var address = {};
if(process.env.NODEENV=="dev"){
    log.debug("Starting APP in Developing Mode");
}else{
    app.locals.pretty = true; //Jade Pretty
    log.debug("Starting APP in Production Mode");
}
address.port = 3002;
var terminator = function(sig){
    if (typeof sig === "string") {
        log.info('%s: Received %s - terminating app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    log.info('%s: Node server stopped.', Date(Date.now()) );
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

//Use public-folder
app.use(express.static(path.join(__dirname, 'public')));

//DB conection
mongoose.connect('mongodb://localhost/webimage');
var db = mongoose.connection;
db.on('error', function(err){
    log.error("Database isn't working",err);
});
db.once('open', function() {
  log.notice("Database Connected");
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
app.listen(address.port,function(){
    log.info('Node server started on %s:%d ...','10.131.137.239',address.port);
});
