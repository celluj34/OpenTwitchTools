﻿var twitchAuth = require('./auth.js');
// defines the explicit handlers methods for socket, without attaching them to a defined event
module.exports = {
    getTheme: (data, callback) => {
        callback({
            theme: 'flatly'
        });
    },
    requestCredentials: (data, callback) => {
        callback({
            username: 'celluj34',
            password: 'password',
            remember: true
        });
    },
    submitCredentials: (data, callback) => {
        twitchAuth.authenticate(data, (result) => {
            if(result.isValid && data.remember) {
                //save
            }

            callback(result);
        });
    }
};