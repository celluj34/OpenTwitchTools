﻿var express = require("express"),
    server = express(),
    router = express.Router(),
    path = require("path"),
    irc = require("twitch-irc"),
    _ = require("underscore"),
    _s = require("underscore.string"),
    lowdb = require("lowdb"),
    socketio = require("socket.io"),
    request = require("request"),
    bodyParser = require("body-parser"),
    app = require("app"),
    BrowserWindow = require("browser-window"),
    moment = require("moment"),
    client,
    mainWindow,
    badges = [];

server.locals.appName = "OpenMod";
server.locals.ipAddress = "127.0.0.1";
server.locals.port = 18044;
server.locals.startupUrl = _s.sprintf("http://%s:%s", server.locals.ipAddress, server.locals.port);
server.locals.index = path.join(__dirname, "index.html");
server.locals.database = path.join(__dirname, "assets", "database.json");
server.locals.icon = path.join(__dirname, "assets", "images", "icon.png");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static(__dirname));

var database = lowdb(server.locals.database);
var settings = database("settings");
var keywords = database("keywords");
var personalCommands = database("personalCommands");

router.route("/")
    .get(function(req, response) {
        response.sendFile(server.locals.index);
    })
    .post(function(req, response) {
        var username = req.body.username;
        var password = req.body.password;
        var channel = req.body.channel;
        var url = "https://api.twitch.tv/kraken?oauth_token=" + password;

        request(url, function(err, resp, body) {
            var data = JSON.parse(body);
            if(!data || !data.token || !data.token.valid || data.token.user_name !== username) {
                response.json({
                    isValid: false,
                    error: "Token is expired or it is registered to another user."
                });
            }
            else {
                settings
                    .chain()
                    .find({id: "Username"})
                    .assign({value: username})
                    .value();

                settings
                    .chain()
                    .find({id: "Password"})
                    .assign({value: password})
                    .value();

                database.save();

                setupConnection(channel, username, password);

                response.json({
                    isValid: true
                });
            }
        });
    });

router.route("/users")
    .post(function(req, response) {
        var channel = req.body.channel;
        var query = req.body.query;
        var url = _s.sprintf("http://tmi.twitch.tv/group/user/%s/chatters", channel);

        request(url, function(err, resp, body) {
            var data = JSON.parse(body);

            var users =
                _.chain(data.chatters)
                    .map(function(group) {
                        return group;
                    })
                    .flatten()
                    .filter(function(item) {
                        return _s.contains(item, query);
                    })
                    .sortBy(function(item) {
                        return item;
                    })
                    .first(5)
                    .value();

            response.json(users);
        });
    });

router.route("/loginInfo")
    .get(function(req, response) {

        var username = settings.find({id: "Username"});
        var password = settings.find({id: "Password"});

        response.json({
            username: username.value,
            password: password.value
        });
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

router.route("/keywords")
    .get(function(req, response) {
        var keywordValues = keywords.pluck("value");

        response.json({keywords: keywordValues});
    })
    .put(function(req, response) {
        var keyword = keywords.find({value: req.body.keyword});

        if(_.isUndefined(keyword)) {
            keywords.push({value: req.body.keyword});

            database.save();

            response.json({
                isValid: true
            });
        }
        else {
            response.json({
                isValid: false,
                error: "Keyword is already defined."
            });
        }
    })
    .delete(function(req, response) {
        keywords.remove({value: req.body.keyword});

        database.save();

        response.json({
            isValid: true
        });
    });

router.route("/personalCommands")
    .get(function(req, response) {
        response.json(personalCommands.cloneDeep());
    })
    .put(function(req, response) {
        var command = personalCommands.find({id: req.body.command});

        if(_.isUndefined(command)) {
            personalCommands.push({
                id: req.body.command,
                value: req.body.value
            });

            database.save();

            response.json({
                isValid: true
            });
        }
        else {
            response.json({
                isValid: false,
                error: "Command is already defined. To update a command you must delete it and re-add it."
            });
        }
    })
    .post(function(req, response) {
        var query = req.body.query;

        var commands =
            personalCommands.chain()
                .map(function(item) {
                    return {
                        id: item.id,
                        name: _s.truncate(item.value, 67)
                    };
                })
                .filter(function(item) {
                    return _s.contains(item.id, query);
                })
                .sortBy(function(item) {
                    return item.id;
                })
                .take(5)
                .value();

        response.json(commands);
    })
    .delete(function(req, response) {
        personalCommands.remove({id: req.body.command});

        database.save();

        response.json({
            isValid: true
        });
    });

//router.route("/emotes")
//    .post(function (req, response) {
//      //use emoteset?
//    var url = "https://api.twitch.tv/kraken/search/channels?q=" + channel;

//    request(url, function (err, resp, body) {
//        var data = JSON.parse(body);

//        var channels = _.chain(data.channels)
//                .map(function (item) {
//            return {
//                id: item.name,
//                name: item.name
//            };
//        })
//                .value();

//        response.json(channels);
//    });
//});

server.use("/", router);

var serverListener = server.listen(server.locals.port, server.locals.ipAddress);

socketio = socketio.listen(serverListener);

socketio.on("connection", function(socket) {
    setupOutgoingCommandHandlers(socket);
});

function setupOutgoingCommandHandlers(socket) {
    socket.on("outgoingMessage", function(data) {
        if(_s.startsWith(data.message, "/me ")) {
            var message = data.message.substring(4);

            if(message.length > 0) {
                client.action(data.channel, message);
            }
        }
        else {
            client.say(data.channel, data.message);
        }
    });

    socket.on("joinChannel", function(data) {
        client.join(data.channel);
    });

    socket.on("timeoutUser", function(data) {
        client.timeout(data.channel, data.user, data.seconds);
    });

    socket.on("banUser", function(data) {
        client.ban(data.channel, data.user);
    });

    socket.on("unbanUser", function(data) {
        client.unban(data.channel, data.user);
    });

    socket.on("leaveChannel", function(data) {
        client.part(data.channel);
    });
}

function setupConnection(initialChannel, username, password) {
    if(!client) {
        var clientSettings = {
            options: {
                debug: false,
                debugIgnore: ["ping", "chat", "action"],
                emitSelf: true,
                logging: false
            },
            identity: {
                username: username,
                password: "oauth:" + password
            }
        };

        if(initialChannel) {
            clientSettings.channels = [initialChannel];
        }

        client = new irc.client(clientSettings);

        client.connect();

        setupIncomingEventListeners(client);
    }
}

function setupIncomingEventListeners(client) {
    client.addListener("action", function(channel, user, message) {
        emitMessage(channel, user, message, true);
    });

    client.addListener("chat", function(channel, user, message) {
        emitMessage(channel, user, message, false);
    });

    client.addListener("hosted", function(channel, user, viewers) {
        //only sent to broadcaster
        socketio.sockets.emit("hosted", {
            name: user,
            channel: channel.substring(1),
            viewers: viewers
        });
    });

    client.addListener("hosting", function(channel, user, viewers) {
        socketio.sockets.emit("hosting", {
            name: user,
            channel: channel.substring(1),
            viewers: viewers
        });
    });

    client.addListener("join", function(channel, user) {
        var channelName = channel.substring(1);

        socketio.sockets.emit("channelJoined", {
            name: user,
            channel: channelName
        });

        getBadges(channelName);
    });

    client.addListener("r9kbeta", function(channel, enabled) {
        socketio.sockets.emit("r9kbeta", {
            channel: channel.substring(1),
            enabled: enabled
        });
    });

    client.addListener("slowmode", function(channel, enabled, length) {
        socketio.sockets.emit("slowmode", {
            channel: channel.substring(1),
            enabled: enabled,
            length: length
        });
    });

    client.addListener("subanniversary", function(channel, user, months) {
        socketio.sockets.emit("subanniversary", {
            name: user,
            channel: channel.substring(1),
            months: months
        });
    });

    client.addListener("subscriber", function(channel, enabled) {
        socketio.sockets.emit("subscribersOnly", {
            channel: channel.substring(1),
            enabled: enabled
        });
    });

    client.addListener("subscription", function(channel, user) {
        socketio.sockets.emit("subscription", {
            name: user,
            channel: channel.substring(1)
        });
    });

    client.addListener("timeout", function(channel, user) {
        socketio.sockets.emit("userTimeout", {
            name: user,
            channel: channel.substring(1)
        });
    });

    client.addListener("unhost", function(channel, viewers) {
        socketio.sockets.emit("unhost", {
            channel: channel.substring(1),
            viewers: viewers
        });
    });
}

function getBadges(channel) {
    var url = _s.sprintf("https://api.twitch.tv/kraken/chat/%s/badges", channel);

    request(url, function(err, resp, body) {
        body = JSON.parse(body);

        var badges = _.chain(body)
            .map(function(badge, index) {
                return {
                    role: index,
                    url: badge.image
                };
            })
            .value();

        badges[channel] = badges;
    });
}

function emitMessage(channel, user, message, action) {
    var data = {
        name: user.username,
        badges: parseAttributes(user.special, channel.substring(1)),
        color: user.color,
        message: parseMessage(message, user.emote),
        channel: channel.substring(1),
        highlight: highlightMessage(message),
        isAction: action,
        timestamp: moment().format("h:mmA")
    };

    socketio.sockets.emit("incomingMessage", data);
}

function parseMessage(message, emotes) {
    var emoteArray = _.chain(emotes)
        .map(function(emote, index) {
            var charIndex = _.map(emote, function(chars) {
                var indexes = chars.split("-");

                return {
                    url: "http://static-cdn.jtvnw.net/emoticons/v1/" + index + "/1.0",
                    startIndex: parseInt(indexes[0]),
                    endIndex: parseInt(indexes[1]) + 1
                };
            });

            return charIndex;
        })
        .flatten()
        .sortBy(function(item) {
            return -1 * item.startIndex;
        })
        .value();

    if(emoteArray.length === 0) {
        return message;
    }

    var newMessage = message;

    _.each(emoteArray, function(emote) {
        var emoteName = newMessage.substring(emote.startIndex, emote.endIndex);

        var leftPart = newMessage.substring(0, emote.startIndex);
        var middlePart = makeImage(emoteName, emote.url);
        var rightPart = newMessage.substring(emote.endIndex);

        newMessage = leftPart + middlePart + rightPart;
    });

    return newMessage;
}

function parseAttributes(attributes, channel) {
    var availableBadges = badges[channel];

    if(!attributes || attributes.length === 0 || !availableBadges || availableBadges.length === 0) {
        return null;
    }

    var attributeString = _.chain(attributes)
        .map(function(attribute) {
            var matchingBadge = _.find(availableBadges, function(badge) {
                return badge.role === attribute;
            });

            return makeImage(matchingBadge.role, matchingBadge.url);
        })
        .value()
        .join(" ");

    return attributeString;
}

function makeImage(name, url) {
    return _s.sprintf("<img alt='%1$s' title='%1$s' src='%2$s' />", name, url);
}

function highlightMessage(comment) {
    var casedComment = comment.toLowerCase();

    var highlight = keywords.find(function(keyword) {
        return _s.contains(casedComment, keyword.value.toLowerCase());
    });

    //required because _.find returns undefined instead of false
    return !_.isUndefined(highlight);
}

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
        "icon": server.locals.icon
    });

    mainWindow.on("closed", function() {
        mainWindow = null;
    });

    mainWindow.openDevTools();
    mainWindow.loadUrl(server.locals.startupUrl);
    mainWindow.show();
});