// defines the explicit handlers methods for socket, without attaching them to a defined event
module.exports = {
    requestCredentials: (data, callback) => {
        callback({
            username: 'celluj34',
            password: 'password',
            remember: true
        });
    },
    submitCredentials: (data, callback) => {
        callback({
            isValid: true
        });
    }
};