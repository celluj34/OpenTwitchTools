var appLoader = require('./node/app-loader'),
    server = require('./node/server'),
    socket = require('./node/socket-config');

// set up expressJS http server
//  pass in the current working directory as the path for all static files.
var serverListener = server.listen(__dirname);

// set up socket.io to listen over expressJS.
//  pass in the previously-created listener
socket.init(serverListener);

// open window and display app
appLoader.run();