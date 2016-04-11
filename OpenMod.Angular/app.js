var express = require('express'),
    server = express(),
    app = require('app'),
    BrowserWindow = require('browser-window'),
    socketio = require('socket.io'),
    mainWindow;

server.locals.ipAddress = '127.0.0.1';
server.locals.port = 18011;
server.locals.startupUrl = 'http://' + server.locals.ipAddress + ':' + server.locals.port + '/index.html';

server.use(express.static(__dirname));

socketio = socketio.listen(server.listen(server.locals.port, server.locals.ipAddress));

socketio.on('connection', function(socket) {
    console.log('socket connected');
});

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        "minwidth": 400,
        "width": 800,
        "minheight": 400,
        "height": 600,
        "center": true,
        "show": false,
        "resizeable": true,
        "webPreferences": {
            "nodeIntegration": false,
        }
    });

    //mainWindow.setMenu(null);

    mainWindow.on('closed', function() {
        mainWindow = null;
        delete mainWindow;
    });

    mainWindow.openDevTools();
    mainWindow.loadURL(server.locals.startupUrl);
    mainWindow.show();
});