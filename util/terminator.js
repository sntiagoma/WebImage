log = new require("log")("info")
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

module.exports = setupTerminationHandlers;