// I hope this file is self-explanatory

const ipAddress = '127.0.0.1',
      port = 18011,
      startupUrl = `http://${ipAddress}:${port}/index.html`;

module.exports = {
    ipAddress: ipAddress,
    port: port,
    startupUrl: startupUrl,
};