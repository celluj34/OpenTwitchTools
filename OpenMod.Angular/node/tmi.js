const tmi = require('tmi.js');

//generate client settings given a username and password
const clientSettings = (username, password) => {
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

        const clientSender = new tmi.client(settings);
        const clientListener = new tmi.client(settings);

        clientSender.connect();
        clientListener.connect();
    }
};