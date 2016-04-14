// I hope this file is self-explanatory

var ipAddress = '127.0.0.1';
var port = 18011;
var startupUrl = `http://${ipAddress}:${port}/index.html`;

module.exports = {
    ipAddress: ipAddress,
    port: port,
    startupUrl: startupUrl
};