/**
 * Método para conectarse a la base de datos.
 * @param  {moongoose} mongoose Paquete desde el require
 * @return {void}          Se conecta a la base de datos
 */
var db = function(mongoose,log){
    mongoose.connect('mongodb://localhost/webimage');
    var db = mongoose.connection;
    db.on('error', function(err){
        log.error("Database isn't working",err);
    });
    db.once('open', function() {
        log.notice("Database Connected");
    });
}
module.exports = db;