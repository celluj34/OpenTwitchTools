var express = require("express");
var http = require("http");
var path = require("path");
var diskdb = require("diskdb");
var net = require("net");
var irc = require("irc-message");
var underscore = require("underscore");
var settingsProvider = require("./providers/settingsProvider.js").SettingsProvider;

var app = express();

// all environments
app.set("views", path.join(__dirname, "views"));
app.set("env", "development");
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
if("development" == app.get("env")) {
	app.use(express.errorHandler());
}

app.get("/", function(req, res) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);
	var channelNames = settingsProvider.GetChannelNames(underscore);

	res.render("login", {
		"Username": settingsProvider.Username(),
		"Password": settingsProvider.Password(),
		"Channels": channelNames
	});
});

app.post("/", function(req, res) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);

	settingsProvider.saveLogin(underscore, req.param("username"), req.param("password"), req.param("channel"), function(error) {
		if(error) {
			res.redirect("/", error);
		}
		else {
			res.redirect("/chat", req.param("channel"));
		}
	});
});

app.get("/chat", function(req, res) {
	diskdb = diskdb.connect("./sharpdb", ["settings"]);
	var settingsProvider = new SettingsProvider(diskdb);
	var channelNames = settingsProvider.GetChannelNames(underscore);
	var channelName = channelNames[0];

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

	net.connect(6667, "irc.twitch.tv")
		.pipe(irc.createStream())
		.on("data", function(message) {
			console.log(message);
		});

	res.render("chat", {
		Channels: channelNames,
		CurrentChannel: channelNames[0],
		Username: settingsProvider.Username(),
		Password: settingsProvider.Password()
	});
});

http.createServer(app).listen(18044);