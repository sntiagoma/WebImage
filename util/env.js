/**
 * Método para verificar el ambiente de ejecución
 * @param  {express} app     Instancia de 
 * @param  {Object} address Objecto de direcciones
 * @param  {Log} log     Log de la aplicación
 * @return {void}         Para o continua ejecutando el proceso
 */
var check = function(app,address,log){    
    if(process.env.NODE_ENV=="dev"){
        log.debug("Starting APP in Developing Mode");
        address.port = process.env.DEVPORT || 8080;
        app.locals.pretty = true;
    }else if(process.env.NODE_ENV=="production"){
        log.notice("Starting APP in Production Mode");
        address.port = process.env.PORT || 80;
        app.locals.pretty = false;
    }else{
        log.error("Please set the NODE_ENV var in your system variables");
        process.exit();
    }
}
module.exports = check;