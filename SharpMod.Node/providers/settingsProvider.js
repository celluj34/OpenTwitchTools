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
	return all(this.settings, "Channel");
};

// Public Methods

SettingsProvider.prototype.saveLogin = function(_, username, password, channel, callback) {
	if(_.isUndefined(username) || _.isEmpty(username.trim())) {
		callback("Username must not be null.");
		return;
	}

	if(_.isUndefined(password) || _.isEmpty(password.trim())) {
		callback("Password must not be null.");
		return;
	}

	this.settings.update({Key: "Username"}, {Value: username});
	this.settings.update({Key: "Password"}, {Value: password});

	var date = getDate();
	var allChannels = this.settings.find({Key: "Channel"});

	var matchingChannels = _.where(allChannels, {Value: channel});

	if(matchingChannels.length === 0) {
		this.settings.save({Key: "Channel", Value: channel, LastAccessed: date});
	}
	else {
		this.settings.update({_id: matchingChannels[0]._id}, {LastAccessed: date});
	}

	callback(null);
};

SettingsProvider.prototype.GetChannelNames = function(_) {
	var channels = all(this.settings, "Channel");

	var sortedChannels = _.sortBy(channels, function(channel) {
		return channel.LastAccessed;
	});

	sortedChannels.reverse();

	var channelNames = _.pluck(sortedChannels, "Value");

	return channelNames;
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