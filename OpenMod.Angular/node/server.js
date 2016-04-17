const express = require('express'),
      constants = require('./constants');

module.exports = {
    listen: (path) => {
        // initialize espress
        const server = express();

        // setup static routes for all files
        server.use(express.static(path));

        //return the listener for use elsewhere
        return server.listen(constants.port, constants.ipAddress);
    }
};