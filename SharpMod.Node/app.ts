import express = require("express");
import routes = require("./routes/index");
import http = require("http");
import path = require("path");
var diskdb = require("diskdb");

var app = express();

// all environments
app.set("port", "18044");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require("stylus");
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

// development only
if("development" == app.get("env")) {
	app.use(express.errorHandler());
}

app.get("/", routes.index);

diskdb = diskdb.connect("sharpModDb", ["userSettings"]);

http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});