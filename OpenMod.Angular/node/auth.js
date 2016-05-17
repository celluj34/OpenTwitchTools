const request = require('request');

const baseUrl = 'https://api.twitch.tv/kraken?oauth_token=';

module.exports = {
    authenticate: (data, callback) => {
        const url = baseUrl + data.password;
        const username = (data.username || '').toLowerCase();

        request(url, (err, resp, body) => {
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