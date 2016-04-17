// I hope this file is self-explanatory

const path = require('path');

const ipAddress = '127.0.0.1',
      port = 18011,
      startupUrl = `http://${ipAddress}:${port}/index.html`,
      database = path.join(__dirname, 'database.json');

module.exports = {
    ipAddress: ipAddress,
    port: port,
    startupUrl: startupUrl,
    database: database
};