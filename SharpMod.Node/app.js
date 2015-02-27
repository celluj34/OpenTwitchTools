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
    client;

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

app.get("/", function(request, response) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);
	var channelNames = settingsProvider.GetChannelNames(_);

	response.render("login", {
		"Username": settingsProvider.Username(),
		"Password": settingsProvider.Password(),
		"Channels": channelNames
	});
});

app.post("/", function(request, response) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);

	settingsProvider.saveLogin(_, request.param("username"), request.param("password"), request.param("channel"), function(error) {
		if(error) {
			response.redirect("/", error);
		}
		else {
			response.redirect("/chat");
		}
	});
});

app.get("/chat", function(request, response) {
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
			console.log(incChannel + " - " + user + " - " + message);
			io.sockets.emit("incomingMessage", {message: message, name: user});
		});

        socket.on("outgoingMessage", function (data) {
	        client.say("channel", data.message);
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

//app.post("/chat", function(request, response) {
//	//The request body expects a param named "message"
//	var message = request.body.message;

//	//If the message is empty or wasn't sent it's a bad request
//	if(_.isUndefined(message) || _.isEmpty(message.trim())) {
//		return response.json(400, {error: "Message is invalid"});
//	}

//	//Let our chatroom know there was a new message
//	freenode.write(message.toString() + "\r\n");

//	//Looks good, let the client know
//	response.json(200, {message: "Message received"});
//});

http.listen(app.get("port"), app.get("ipaddr"), function() {
	console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});