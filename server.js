#!/usr/bin/env node

var express        = require("express");                   //Server
var fs             = require("fs");                        //Filesystem (read/wrote files)
var path           = require("path");                      //Path
var mongoose       = require("mongoose");                  //Mongodb ODM (Object Document Mapper)
var favicon        = require("serve-favicon");             //favicon.ico provider
var morgan         = require("morgan");                    //HTTP request logger
var cookieParser   = require("cookie-parser");             //Cookie Manager
var bodyParser     = require("body-parser");               //JSON-Raw-Text-URLEncoded body parser
var Log            = require("log"), log = new Log("info");//Log Manager
var passport       = require("passport");                  //Passport
var expressSession = require("express-session");           //Session Manager
var flash          = require("connect-flash");             //Messages while user is redirected
var multer         = require("multer");                    //File Upload
var Mime           = require("./util/mime");
// Log Levels
// 0 EMERGENCY system is unusable
// 1 ALERT action must be taken immediately
// 2 CRITICAL the system is in critical condition
// 3 ERROR error condition
// 4 WARNING warning condition
// 5 NOTICE a normal but significant condition
// 6 INFO a purely informational message
// 7 DEBUG messages to debug an application

/**
 * Objecto con la direccion y el puerto
 * @type {Object}
 */
var address = {};

/**
 * Aplicación express
 * @type {express}
 */
var app = express();

//Set up server IP address and port # with env
require("./util/env.js")(app,address,log);

//HTTP Logger
app.use(morgan("combined"));

//Cookie Manager
app.use(cookieParser());

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Messages while user redirects
app.use(flash());

//Passport
app.use(expressSession({secret: 'una_clave_secreta'}));
app.use(passport.initialize());
app.use(passport.session());
require("./util/passport/init")(passport);

//Terminator
require("./util/terminator.js")();

//Use public-folder
app.use(express.static(path.join(__dirname, 'public')));

//DB conection
require("./util/db.js")(mongoose,log);

//View Engine Setup (Jade)
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

//Favicon
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

//File Uploader

//AQUI SE HACE EL ROUND ROBIN
var path_to_file_204 = '/mnt/nodo204images';
var path_to_file_180 = '/mnt/nodo180images';
var bool = true;

var storage = multer.diskStorage({
  destination: function(req, file, db){
    cb(null, bool ? path_to_file_204 : path_to_file_180);
    bool = !bool; //shuffle
  }
});

var uploading = multer(
    {
        dest: path.join(__dirname,'public','file'),
        limits: {
            fileSize: 10000000, //Aprox. 10MB
            files:1
        },
        fileFilter: function(req, file, cb){
            var mime = new Mime(file.mimetype);
            if(mime.isImage()){
                cb(null,true);
            }else{
                cb(null,false);
            }
        },
        storage: storage
    }
);

//Routes
require("./util/routes/init")(app, passport, uploading);

var server = require("http").Server(app);
//var io = require('socket.io')(server);

//Setting Socket.io Server
//io.on("connection",


//Start
server.listen(address.port,function(){
    log.info('Server running on %s:%d ...','localhost',address.port);
});
