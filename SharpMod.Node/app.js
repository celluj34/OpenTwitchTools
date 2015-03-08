var express = require("express"),
    server = express(),
    path = require("path"),
    diskdb = require("diskdb"),
    irc = require("twitch-irc"),
    _ = require("underscore"),
    settingsProvider = require("./providers/settingsProvider.js").SettingsProvider,
    socketio = require("socket.io"),
    request = require("request"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    router = express.Router(),
    client;

server.locals.ipAddress = "127.0.0.1";
server.locals.port = 18044;
server.locals.index = path.join(__dirname, "views", "index.html");
server.locals.database = path.join(__dirname, "sharpdb");

server.use(compression());
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static(__dirname));

diskdb.connect(server.locals.database, ["settings"]);
var settingsProvider = new SettingsProvider(diskdb);

router.route("/")
	.get(function(req, response) {
		response.sendFile(server.locals.index);
	})
	.post(function(req, response) {
		var username = req.body.username;
		var password = req.body.password;
		var channel = req.body.channel;
		var url = "https://api.twitch.tv/kraken/?oauth_token=" + password.replace("oauth:", "");

		request(url, function(err, resp, body) {
			var data = JSON.parse(body);
			if(!data || !data.token || !data.token.valid || data.token.user_name !== username) {
				response.json({isValid: false, error: "Token is expired or it is registered to another user."});
			}
			else {
				settingsProvider.saveLogin(_, username, password, channel, function(error) {
					if(error) {
						response.json({isValid: false, error: error});
					}
					else {
						setupConnection();

						response.json({
							isValid: true,
							channel: channel
						});
					}
				});
			}
		});
	});

router.route("/loginInfo")
	.get(function(req, response) {
		var username = settingsProvider.Username();
		var password = settingsProvider.Password();
		var channelNames = settingsProvider.GetChannelNames(_);

		response.send({
			username: username,
			password: password,
			channels: channelNames
		});
	});

router.route("/badges")
	.get(function(req, response) {
		var url = "https://api.twitch.tv/kraken/chat/" + req.query.channel + "/badges";

		request(url, function(err, resp, body) {
			body = JSON.parse(body);

			var badgeList = [];

			badgeList.push({
				role: "global_mod",
				url: body.global_mod.image
			});

			badgeList.push({
				role: "admin",
				url: body.admin.image
			});

			badgeList.push({
				role: "broadcaster",
				url: body.broadcaster.image
			});

			badgeList.push({
				role: "mod",
				url: body.mod.image
			});

			badgeList.push({
				role: "staff",
				url: body.staff.image
			});

			badgeList.push({
				role: "turbo",
				url: body.turbo.image
			});

			var subscriber = {
				role: "subscriber",
				url: null
			};

			if(body.subscriber) {
				subscriber.url = body.subscriber.image;
			}

			badgeList.push(subscriber);

			response.send({
				channel: req.query.channel,
				badges: badgeList
			});
		});
	});

server.use("/", router);

var serverListener = server.listen(server.locals.port, server.locals.ipAddress, function() {
	console.log("Server up and running. Go to http://" + server.locals.ipAddress + ":" + server.locals.port);
});

socketio = socketio.listen(serverListener);

socketio.on("connection", function(socket) {
	socket.on("outgoingMessage", function(data) {
		client.say(data.channel, data.message);
	});

	//socket.on("ban", function(data) {
	//       client.ban(data.user);
	//});
});

function setupConnection() {
	var username = settingsProvider.Username();
	var password = settingsProvider.Password();
	var channelNames = settingsProvider.GetChannelNames(_);
	var channel = "#" + channelNames[0];

	client = new irc.client({
		options: {
			debug: true,
			debugIgnore: ["ping", "chat", "action"],
			logging: false,
			tc: 3
		},
		identity: {
			username: username,
			password: password
		},
		channels: [channel]
	});

	client.connect();

    client.addListener("chat", function (incChannel, user, message) {
        var newMessage = message;

        _.each(user.emote, function (emote, index) {
            var url = "http://static-cdn.jtvnw.net/emoticons/v1/" + index + "/1.0";

            _.each(emote, function (chars) {
                var indexes = chars.split("-");
                var firstHalf = newMessage.substring(0, indexes[0]);
                var replacement = "<img alt='" + newMessage.substring(indexes[0], indexes[1] + 1) + "' src='" + url + "' />";
	            var secondHalf = newMessage.substring(indexes[1] + 1);

	            newMessage = firstHalf + replacement + secondHalf;
            });
        });

		socketio.sockets.emit("incomingMessage", {
			name: user.username,
			attributes: user.special,
			color: user.color,
			message: newMessage,
			channel: incChannel.replace("#", "")
		});
	});

	//client.addListener("timeout", function(incChannel, user, message) {
	//	socketio.sockets.emit("timeout", {
	//		name: user.username,
	//		attributes: user.special,
	//		emote_set: user.emote,
	//		color: user.color,
	//		message: message,
	//		channel: incChannel
	//	});
	//});
};