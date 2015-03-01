EmoticonProvider = function(diskDb) {
	this.emoticon = diskDb.emoticon;
};

EmoticonProvider.prototype.emoticon = null;

// Public Properties

EmoticonProvider.prototype.Username = function() {
	return single(this.emoticon, "Username");
};

EmoticonProvider.prototype.Password = function() {
	return single(this.emoticon, "Password");
};

EmoticonProvider.prototype.Channels = function() {
	return all(this.emoticon, "Channel");
};

// Public Methods

EmoticonProvider.prototype.saveLogin = function(_, username, password, channel, callback) {
	if(_.isUndefined(username) || _.isEmpty(username.trim())) {
		callback("Username must not be null.");
		return;
	}

	if(_.isUndefined(password) || _.isEmpty(password.trim())) {
		callback("Password must not be null.");
		return;
	}

	this.emoticon.update({Key: "Username"}, {Value: username});
	this.emoticon.update({Key: "Password"}, {Value: password});

	var date = getDate();
	var allChannels = this.emoticon.find({Key: "Channel"});

	var matchingChannels = _.where(allChannels, {Value: channel});

	if(matchingChannels.length === 0) {
		this.emoticon.save({Key: "Channel", Value: channel, LastAccessed: date});
	}
	else {
		this.emoticon.update({_id: matchingChannels[0]._id}, {LastAccessed: date});
	}

	callback(null);
};

EmoticonProvider.prototype.GetChannelNames = function(_) {
	var channels = all(this.emoticon, "Channel");

	var sortedChannels = _.sortBy(channels, function(channel) {
		return channel.LastAccessed;
	});

	sortedChannels.reverse();

	var channelNames = _.pluck(sortedChannels, "Value");

	return channelNames;
};

// Helper Methods

function single(emoticon, key) {
	var results = emoticon.findOne({Key: key});
	if(results) {
		return results.Value;
	}

	return null;
};

function all(emoticon, key) {
	return emoticon.find({Key: key});
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