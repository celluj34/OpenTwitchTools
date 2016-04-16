var request = require('request');

var baseUrl = 'https://api.twitch.tv/kraken?oauth_token=';

module.exports = {
    authenticate: (data, callback) => {
        const url = baseUrl + data.password;
        const username = (data.username || '').toLowerCase();

        request(url, function(err, resp, body) {
            const responseBody = JSON.parse(body);
            if(!responseBody || !responseBody.token || !responseBody.token.valid || responseBody.token.user_name.toLowerCase() !== username) {
                callback({
                    isValid: false,
                    error: 'Token is expired or it is registered to another user.'
                });
            }
            else {
                callback({
                    isValid: true,
                    error: null
                });
            }
        });
    }
};