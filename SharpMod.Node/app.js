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
    router = express.Router(),
    client;

server.locals.ipAddress = "127.0.0.1";
server.locals.port = 18044;
server.locals.index = path.join(__dirname, "views", "index.html");
server.locals.database = path.join(__dirname, "sharpdb");

server.use(compression());
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
		var url = "https://api.twitch.tv/kraken/?oauth_token=" + password;

		request(url, function(err, resp, body) {
			var data = JSON.parse(body);
			if(!data || !data.token || !data.token.valid || data.token.user_name !== username) {
				response.json({isValid: false, error: "Token is expired or it is registered to another user."});
			}
			else {
				settingsProvider.saveLogin(_, username, password, function(error) {
					if(error) {
						response.json({isValid: false, error: error});
					}
					else {
						setupConnection(channel);

						response.json({
							isValid: true
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

		response.send({
			username: username,
			password: password
		});
	});

router.route("/search")
	.post(function(req, response) {
		var channel = req.body.channel;
		var url = "https://api.twitch.tv/kraken/search/channels?q=" + channel;

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

			if(body.subscriber) {
				var subscriber = {
					role: "subscriber",
					url: body.subscriber.image
				};

				badgeList.push(subscriber);
			}

			response.send({
				channel: req.query.channel,
				badges: badgeList
			});
		});
	});

server.use("/", router);

var serverListener = server.listen(server.locals.port, server.locals.ipAddress);

socketio = socketio.listen(serverListener);

socketio.on("connection", function(socket) {
	setupOutgoingCommandHandlers(socket);
});

var setupOutgoingCommandHandlers = function(socket) {
	socket.on("outgoingMessage", function(data) {
		client.say(data.channel, data.message);

		socket.emit("incomingMessage", {
			name: client.myself,
			//attributes: user.special,
			//color: user.color,
			message: data.message,
			channel: data.channel
		});
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
};

function setupConnection(initialChannel) {
	if(!client) {
		var clientSettings = {
			options: {
				debug: true,
				debugIgnore: ["ping", "chat"],
				logging: true,
				tc: 3
			},
			identity: {
				username: settingsProvider.Username(),
				password: "oauth:" + settingsProvider.Password()
			}
		};

		if(initialChannel) {
			clientSettings.channels = [initialChannel];
		}

		client = new irc.client(clientSettings);

		client.connect();

		setupIncomingEventListeners(client);
	}
};

function setupIncomingEventListeners(client) {
	client.addListener("chat", function(channel, user, message) {
		var parsedMessage = message;

		_.chain(user.emote)
			.map(function(emote, index) {
				var url = "http://static-cdn.jtvnw.net/emoticons/v1/" + index + "/1.0";

				var charIndex = _.map(emote, function(chars) {
					var indexes = chars.split("-");

					return {
						url: url,
						startIndex: parseInt(indexes[0]),
						endIndex: parseInt(indexes[1]) + 1
					};
				});

				return charIndex;
			})
			.flatten()
			.sortBy(function(item) {
				return -1 * item.startIndex;
			}).each(function(emote) {
				var firstHalf = parsedMessage.substring(0, emote.startIndex);
				var replacement = "<img title='" + parsedMessage.substring(emote.startIndex, emote.endIndex) + "' src='" + emote.url + "' />";
				var secondHalf = parsedMessage.substring(emote.endIndex);

				parsedMessage = firstHalf + replacement + secondHalf;
			});

		socketio.sockets.emit("incomingMessage", {
			name: user.username,
			attributes: _.uniq(user.special),
			color: user.color,
			message: parsedMessage,
			channel: channel.replace("#", "")
		});
	});

	client.addListener("join", function(channel, user) {
		socketio.sockets.emit("channelJoined", {
			name: user,
			channel: channel.replace("#", "")
		});
	});
};