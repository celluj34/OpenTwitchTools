var express = require("express"),
    server = express(),
    router = express.Router(),
    path = require("path"),
    _ = require("underscore"),
    _s = require("underscore.string"),
    request = require("request"),
    bodyParser = require("body-parser"),
    app = require("app"),
    BrowserWindow = require("browser-window"),
    mainWindow;

//https://github.com/justintv/Twitch-API/blob/master/embedding.md
//https://github.com/justintv/Twitch-API/blob/master/player.md

server.locals.appName = "OpenView";
server.locals.ipAddress = "127.0.0.1";
server.locals.port = 18011;
server.locals.startupUrl = _s.sprintf("http://%s:%s", server.locals.ipAddress, server.locals.port);
server.locals.index = path.join(__dirname, "index.html");
server.locals.database = path.join(__dirname, "assets", "database.json");
server.locals.icon = path.join(__dirname, "assets", "images", "icon.png");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static(__dirname));

router.route("/")
    .get(function(req, response) {
        response.sendFile(server.locals.index);
    });

router.route("/search")
    .post(function(req, response) {
        var url = _s.sprintf("https://api.twitch.tv/kraken/search/channels?q=%s", req.body.channel);

        request(url, function(err, resp, body) {
            var data = JSON.parse(body);

            var channels = _.chain(data.channels)
                .map(function(item) {
                    return {
                        id: item.name,
                        name: item.name
                    };
                })
                .value();

            response.json(channels);
        });
    });

server.use("/", router);

var serverListener = server.listen(server.locals.port, server.locals.ipAddress);

app.on("window-all-closed", function() {
    app.quit();
});

app.on("ready", function() {
    mainWindow = new BrowserWindow({
        "min-width": 400,
        "width": 800,
        "min-height": 400,
        "height": 600,
        "center": true,
        "node-integration": false,
        "show": false,
        "title": server.locals.appName,
        "icon": server.locals.icon,
        "resizeable": true,
        "web-preferences": {
            "plugins": true
        }
    });

    mainWindow.setMenu(null);

    mainWindow.on("closed", function() {
        mainWindow = null;
    });

    //mainWindow.openDevTools();
    mainWindow.loadUrl(server.locals.startupUrl);
    mainWindow.show();
});