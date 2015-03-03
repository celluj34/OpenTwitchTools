var express = require("express"),
    app = express(),
    path = require("path"),
    diskdb = require("diskdb"),
    irc = require("twitch-irc"),
    _ = require("underscore"),
    settingsProvider = require("./providers/settingsProvider.js").SettingsProvider,
    io = require("socket.io").listen(http),
    request = require("request"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    router = express.Router(),
    client;

app.locals.ipAddress = "127.0.0.1";
app.locals.port = 18044;
app.locals.index = path.join(__dirname, "index.html");
app.locals.database = path.join(__dirname, "sharpdb/"); //diskDb doesn't like variable names for some reason

app.use(compression);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

diskdb.connect("./sharpdb", ["settings"]);
var settingsProvider = new SettingsProvider(diskdb);

router.route("/")
	.get(function(req, response) {
		response.sendFile(app.locals.index);
	})
	.post(function(req, response) {
		var username = req.body.username;
		var password = req.body.password.replace("oauth:", "");
		var channel = req.body.channel;

		request("https://api.twitch.tv/kraken/?oauth_token=" + password, function(err, resp, body) {
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
						response.json({isValid: true});
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

router.route("/emotes")
	.get(function(req, response) {
		var url = "https://api.twitch.tv/kraken/chat/emoticons";

		request(url, function(err, resp, body) {
			body = JSON.parse(body);

			var emotes = _.chain(body.emoticons)
				.map(function(emoticonSet) {
					return _.map(emoticonSet.images, function(image) {
						return {
							regex: emoticonSet.regex,
							url: "<img alt='" + emoticonSet.regex + "' height='" + image.height + "' width='" + image.width + "' src='" + image.url + "' />",
							emoticon_set: image.emoticon_set
						};
					});
				})
				.flatten()
				.value();

			response.send(emotes);
		});
	});

router.route("/badges")
	.get(function(req, response) {
		var url = "https://api.twitch.tv/kraken/chat/" + req.param.channel + "/badges";

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

			response.send(badgeList);
		});
	});

router.route("/chat")
	.get(function(req, response) {
		var username = settingsProvider.Username();
		var password = settingsProvider.Password();
		var channelNames = settingsProvider.GetChannelNames(_);
		var channel = "#" + channelNames[0];

		io.on("connection", function(socket) {
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

			client.addListener("chat", function(incChannel, user, message) {
				io.sockets.emit("incomingMessage", {
					name: user.username,
					attributes: user.special,
					emote_set: user.emote,
					color: user.color,
					message: message,
					channel: incChannel
				});
			});

			socket.on("outgoingMessage", function(data) {
				client.say(channel, data);
			});

			///*
			//  When a new user connects to our server, we expect an event called "newUser"
			//  and then we'll emit an event called "newConnection" with a list of all 
			//  participants to all connected clients
			//*/
			//socket.on("newUser", function(data) {
			//	participants.push({id: data.id, name: data.name});
			//	io.sockets.emit("newConnection", {participants: participants});
			//});

			///* 
			//  When a client disconnects from the server, the event "disconnect" is automatically 
			//  captured by the server. It will then emit an event called "userDisconnected" to 
			//  all participants with the id of the client that disconnected
			//*/
			//socket.on("disconnect", function() {
			//	participants = _.without(participants, _.findWhere(participants, {id: socket.id}));
			//	io.sockets.emit("userDisconnected", {id: socket.id, sender: "system"});
			//});

		});

		response.render("chat", {
			Channels: channelNames,
			CurrentChannel: channel,
			Username: username,
			Password: password
		});
	});

app.use("/", router);

app.listen(app.locals.port, app.locals.ipAddress, function() {
	console.log("Server up and running. Go to http://" + app.locals.ipAddress + ":" + app.locals.port);
});