const lowdb = require('lowdb'),
      storage = require('lowdb/file-sync'),
      constants = require('./constants'),
      database = lowdb(constants.database, {storage});

const usernameKey = 'Username';
const passwordKey = 'Password';
const rememberKey = 'Remember';
const settingsDatabase = 'Settings';

module.exports = {
    getCredentials: () => {
        const settings = database(settingsDatabase);

        const username = settings.find({id: usernameKey});
        const password = settings.find({id: passwordKey});
        const remember = settings.find({id: rememberKey});

        return {
            username: username.value,
            password: password.value,
            remember: remember.value
        };
    },
    saveCredentials: (data) => {
        const settings = database(settingsDatabase);

        const username = data.username || '';
        settings
            .chain()
            .find({id: usernameKey})
            .assign({value: username})
            .value();

        const password = data.password || '';
        settings
            .chain()
            .find({id: passwordKey})
            .assign({value: password})
            .value();

        const remember = data.remember || false;
        settings
            .chain()
            .find({id: rememberKey})
            .assign({value: remember})
            .value();
    }
};