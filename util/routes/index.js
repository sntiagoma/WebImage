var express = require('express');
var router  = express.Router();
var Mime    = require("../../util/mime");
var Image   = require("../../models/image");
var User    = require("../../models/user");

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

module.exports = function(passport, uploading){
    router.get('/', function(req, res) {
      res.render('index', { title: 'Iris' });
    });

    router.get('/signin', function(req, res) {
        res.render('login', { message: req.flash('message') });
    });
    router.post('/signin', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash : true
    }));

    router.get('/signup', function(req, res){
        res.render('register',{message: req.flash('message')});
    });

    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true
    }));

    router.get('/home', isAuthenticated, function(req, res){
        res.render('home', { user: req.user });
    });

    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/signin');
    });

    router.get('/upload', isAuthenticated, function(req, res){
       res.render('upload',{user:req.user});
    });

    router.post('/upload', isAuthenticated, uploading.single("image"), function(req, res){
        var mime = new Mime(req.file.mimetype);
        if(mime.isImage()){
            try{
                req.user.save(function(error){
                    if(error){
                        return handleError(error)
                    }
                    var file = req.file;
                    var image = new Image({
                            originalname: file.originalname,
                            encoding: file.encoding,
                            mimetype: file.mimetype,
                            filename: file.filename,
                            size: file.size,
                            date: new Date(),
                            user: req.user.id,
                    });
                    image.save(function(error){
                        if(error){
                            res.send("Error while trying to save image to the db");
                            return;
                        }
                    });
                    req.user.images.push(image.id);
                    req.user.save(function(error){
                        if(error){
                            res.send("Error while trying to add image to the user");
                            return;
                        }
                    });
                    res.redirect("/image/"+image._id);
                });
            }catch(e){
                res.send(e);
            }
        }else{
            res.send("Error While trying to upload image");
        }
    });

    router.get("/user/:id", function(req, res){
        User.findOne(
            {username: req.params.id},
            function(error, user){
                if(error){
                    res.redirect("/404");
                }else{
                    if(user==null){
                        res.redirect("/404");
                    }
                    res.render('user',{user:user});
                }
            }
        );
    });

    router.get("/image/:id", function(req, res){
        Image.findOne(
            {_id: req.params.id},
            function(error, image){
                if(error){
                    res.redirect("/404");
                }
                res.render('image',{image:image});
            }
        );
    });
    return router;
}
