var express = require("express"),
    app = express(),
    http = require("http").createServer(app),
    path = require("path"),
    diskdb = require("diskdb"),
    net = require("net"),
    irc = require("irc"),
    _ = require("underscore"),
    settingsProvider = require("./providers/settingsProvider.js").SettingsProvider;

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
	var channelNames = settingsProvider.GetChannelNames(_);

	//var client = irc.Client("irc.twitch.tv", {
	//	userName: "nodebot",
	//	realName: "nodebot",
	//	port: 6667,
	//	localAddress: null,
	//	debug: false,
	//	showErrors: false,
	//	autoRejoin: false,
	//	autoConnect: false,
	//	channels: [],
	//	secure: false,
	//	selfSigned: false,
	//	certExpired: false,
	//	floodProtection: false,
	//	floodProtectionDelay: 1500,
	//	sasl: false,
	//	stripColors: false,
	//	channelPrefixes: "&#",
	//	messageSplit: 512,
	//	encoding: ""
	//});

	response.render("chat", {
		Channels: channelNames,
		CurrentChannel: channelNames[0],
		Username: settingsProvider.Username(),
		Password: settingsProvider.Password()
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