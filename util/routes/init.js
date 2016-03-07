var indexRoute = require("./index");
var apiRoute = require("./api");


/**
 * Asigna las rutas a cada vista de la aplicación
 * @param  {express} app Instancia de la aplicación express
 * @return {void}     Asigna las vistas a cada ruta de la App
 */
var views = function(app, passport){
    app.use('/',indexRoute(passport));
    app.use('/api',apiRoute());
    app.use(
        function(req,res,next){
            var err = new Error('Not Found');
            err.status = 404;
            res.status(err.status).render('error',{error:err});
            next(err);
        }
    );
};
module.exports = views;