const app = require('app'),
      constants = require('./constants'),
      BrowserWindow = require('browser-window');

module.exports = {
    run: () => {
        // when the window closes, explicitly close the app
        app.on('window-all-closed', () => {
            app.quit();
        });

        // when the app is ready, load up the window
        app.on('ready', () => {
            // instantiate a new electron window and set some defaults. node integration in the browser is OFF (avoid that overhead)
            var mainWindow = new BrowserWindow({
                "minwidth": 400,
                "width": 800,
                "minheight": 400,
                "height": 600,
                "center": true,
                "show": false,
                "resizeable": true,
                "webPreferences": {
                    "nodeIntegration": false,
                }
            });

            // sometimes you have to explicitly remove the menu bar (file, bookmarks, help, etc)
            //mainWindow.setMenu(null);

            // after the window itself closes, manually remove it from memory
            mainWindow.on('closed', () => {
                mainWindow = null;
                delete mainWindow;
            });

            // dev tools are important when debugging
            mainWindow.openDevTools();

            mainWindow.loadURL(constants.startupUrl);
            mainWindow.show();
        });
    }
};