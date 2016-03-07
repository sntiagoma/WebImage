#!/usr/bin/env node

//Import
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

// Log Levels
// 0 EMERGENCY system is unusable
// 1 ALERT action must be taken immediately
// 2 CRITICAL the system is in critical condition
// 3 ERROR error condition
// 4 WARNING warning condition
// 5 NOTICE a normal but significant condition
// 6 INFO a purely informational message
// 7 DEBUG messages to debug an application

var address = {};

//Routes import
var indexRoute = require("./routes/index");
var apiRoute = require("./routes/api");

//Express App
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

//Passport
app.use(expressSession({secret: 'una_clave_secreta'}));
app.use(passport.initialize());
app.use(passport.session());

/*

passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser(funtcion(user, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});


passport.use('login', new LocalStrategy(
    {
        passReqToCallback: true
    },
    function(req, username, password, done){
        User.findOne({'username': username},
            function(err, user){
                if(err){
                    return done(err);
                }
                if(!user){
                    log.info('User not found: '+ username);
                    return done(null, false, req.flash('message', 'user not found'));
                }
                if(!isValidPassword(user, password)){
                    log.info('Invalid password');
                    return done(null, false, req.flash('message', 'invalid password'));
                }
                return done(null, user);
            }
        )
    }

));

var isValidPassword = function(user, pass){
    return bCrypt.compareSync(pass, user.password);
}


passport.use('signup', new LocalStrategy({
    passReqToCallback: true
    },
    function(req, username, password, done){
        findOrCreate = function(){
            User.findOne({'username': username}, function(err, user){
                if(err){
                    log.info('Error in signup: '+ err);
                    return done(err);
                }
                if(user){
                    log.info('user already exists');
                    return done(null, false, req.flash('message', 'user already exists'));
                } else{
                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = password;
                    newUser.email = email;
                    newUser.gender = gender;
                    newUser.save(function(err){
                        if(err){
                            log.info('error saving user: '+ user);
                            throw err;
                        }
                        log.info('user created successfully\n');
                        return done(null, newUser);
                    });
                }
            });
        };
        process.nextTick(findOrCreate);
    }
    );
);

var createHash = function(pass){
    return bCrypt.hashSync(pass, bCrypt.genSaltSync(10), null);
}

*/



//Terminator
require("./util/terminator.js")();

//Use public-folder
app.use(express.static(path.join(__dirname, 'public')));

//DB conection
require("./util/db.js")(mongoose);

//View Engine Setup (Jade)
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

//Favicon
app.use(favicon(path.join(__dirname,'public','favicon.ico')));


//Routes
require("./util/routes.js")(app);

var server = require("http").Server(app);
//var io = require('socket.io')(server);

//Setting Socket.io Server
//io.on("connection",



//Start
server.listen(address.port,function(){
    log.info('Server running on %s:%d ...','localhost',address.port);
});