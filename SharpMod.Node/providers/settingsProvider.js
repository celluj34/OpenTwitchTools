SettingsProvider = function(diskDb) {
	this.settings = diskDb.settings;
};

SettingsProvider.prototype.settings = null;

// Public Properties

SettingsProvider.prototype.Username = function() {
	return single(this.settings, "Username");
};

SettingsProvider.prototype.Password = function() {
	return single(this.settings, "Password");
};

SettingsProvider.prototype.Channels = function() {
	var channels = all(this.settings, "Channel");

	channels.sort(function(a, b) {
		if(a.LastAccessed > b.LastAccessed) {
			return -1;
		}

		if(a.LastAccessed < b.LastAccessed) {
			return 1;
		}

		return 0;
	});

	return channels;
};

// Public Methods

SettingsProvider.prototype.saveLogin = function(underscore, username, password, channel, callback) {
	if(!username || 0 === username.length) {
		callback("Username must not be null.");
		return;
	}

	if(!password || 0 === password.length) {
		callback("Password must not be null.");
		return;
	}

	var options = {
		multi: false,
		upsert: true
	};

	this.settings.update({Key: "Username"}, {Value: username}, options);
	this.settings.update({Key: "Password"}, {Value: password}, options);

	var date = getDate();
	var allChannels = this.settings.find({Key: "Channel"});

	var matchingChannels = underscore.where(allChannels, {Value: channel});

	if(matchingChannels.length === 0) {
		this.settings.save({Key: "Channel", Value: channel, LastAccessed: date});
	}

	callback(null);
};

// Helper Methods

function single(settings, key) {
	var results = settings.findOne({Key: key});
	if(results) {
		return results.Value;
	}

	return null;
};

function all(settings, key) {
	return settings.find({Key: key});
};

function getDate() {
	var today = new Date();
	var year = today.getFullYear();
	var month = prettyNumber(today.getMonth());
	var day = prettyNumber(today.getDate());
	var hour = prettyNumber(today.getHours());
	var minute = prettyNumber(today.getMinutes());
	var second = prettyNumber(today.getSeconds());

	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
};

function prettyNumber(number) {
	if(number < 10) {
		return "0" + number;
	}

	return number;
};