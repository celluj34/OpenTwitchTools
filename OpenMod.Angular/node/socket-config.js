const socketio = require('socket.io'),
      socketHandlers = require('./socket-handlers');

const attach = (socket) => {
    socket.on('get-theme', socketHandlers.getTheme);
    socket.on('request-credentials', socketHandlers.requestCredentials);
    socket.on('submit-credentials', socketHandlers.submitCredentials);
};

module.exports = {
    init: (server) => {
        // set up a websocket listener on the already-created express server
        var socket = socketio.listen(server);

        // when a new client is connected, attach all of our handlers to it
        socket.on('connection', attach);
    }
};