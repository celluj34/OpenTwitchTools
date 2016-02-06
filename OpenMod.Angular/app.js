var express = require('express'),
    server = express(),
    app = require('app'),
    BrowserWindow = require('browser-window'),
    mainWindow;

server.locals.ipAddress = '127.0.0.1';
server.locals.port = 18011;
server.locals.startupUrl = 'http://' + server.locals.ipAddress + ':' + server.locals.port + '/app/views/login.html';

server.use(express.static(__dirname));

server.listen(server.locals.port, server.locals.ipAddress);

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        "min-width": 400,
        "width": 800,
        "min-height": 400,
        "height": 600,
        "center": true,
        "node-integration": false,
        "show": false,
        "resizeable": true
    });

    //mainWindow.setMenu(null);

    mainWindow.on('closed', function() {
        mainWindow = null;
        delete mainWindow;
    });

    //mainWindow.openDevTools();
    mainWindow.loadURL(server.locals.startupUrl);
    mainWindow.show();
});