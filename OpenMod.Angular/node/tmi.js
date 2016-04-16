﻿var tmi = require('tmi.js');

//generate client settings given a username and password
var clientSettings = (username, password) => {
    return {
        options: {
            debug: false
        },
        connection: {
            cluster: 'aws',
            reconnect: true,
            secure: true
        },
        identity: {
            username: username,
            password: password
        }
    };
};

module.exports = {
    connect: (username, password) => {
        const settings = clientSettings(username, password);

        var clientSender = new tmi.client(settings);
        var clientListener = new tmi.client(settings);

        clientSender.connect();
        clientListener.connect();
    }
};