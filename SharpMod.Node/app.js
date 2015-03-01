var express = require("express"),
    app = express(),
    http = require("http").createServer(app),
    path = require("path"),
    diskdb = require("diskdb"),
    net = require("net"),
    irc = require("twitch-irc"),
    _ = require("underscore"),
    settingsProvider = require("./providers/settingsProvider.js").SettingsProvider,
    io = require("socket.io").listen(http),
    request = require("request"),
    client;

app.use(express.compress());

// all environments
app.set("ipaddr", "127.0.0.1");
app.set("port", 18044);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require("stylus").middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

// development only
app.set("env", "development");
if("development" == app.get("env")) {
	app.use(express.errorHandler());
}

app.get("/", function(req, response) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);
	var channelNames = settingsProvider.GetChannelNames(_);
    
    response.render("login", {
		"Username": settingsProvider.Username(),
		"Password": settingsProvider.Password(),
		"Channels": channelNames
	});
});

app.get("/emotes", function(req, response) {
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

app.get("/badges", function(req, response) {
	var url = "https://api.twitch.tv/kraken/chat/" + req.param("channel") + "/badges";

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

app.post("/", function(req, response) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);

	settingsProvider.saveLogin(_, req.param("username"), req.param("password"), req.param("channel"), function(error) {
		if(error) {
			response.redirect("/", error);
		}
		else {
			response.redirect("/chat");
		}
	});
});

app.get("/chat", function(req, response) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);
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
			// https://github.com/Schmoopiie/twitch-irc/wiki/Command:-Say 
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
		//  When a user changes his name, we are expecting an event called "nameChange" 
		//  and then we'll emit an event called "nameChanged" to all participants with
		//  the id and new name of the user who emitted the original message
		//*/
		//socket.on("nameChange", function(data) {
		//	_.findWhere(participants, {id: socket.id}).name = data.name;
		//	io.sockets.emit("nameChanged", {id: data.id, name: data.name});
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

http.listen(app.get("port"), app.get("ipaddr"), function() {
	console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});