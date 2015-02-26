SettingsProvider = function(diskDb) {
	this.settings = diskDb.settings;
};

SettingsProvider.prototype.settings = null;

SettingsProvider.prototype.Username = function() {
	return findSetting(this.settings, "Username") || "";
};

SettingsProvider.prototype.Password = function() {
	return findSetting(this.settings, "Password") || "";
};

SettingsProvider.prototype.Channels = function() {
	return findSetting(this.settings, "Channels") || [];
};

function findSetting(settings, key) {
	var findOne = settings.findOne({Key: key});
	if(findOne) {
		return findOne.Value;
	}

	return null;
};

SettingsProvider.prototype.saveLogin = function(username, password, channel, callback) {
	if(!username || 0 === username.length) {
		callback("Username must not be null.");
	}

	if(!password || 0 === password.length) {
		callback("Password must not be null.");
		return;
	}

	var options = {
		multi: false,
		upsert: true
	};

	this.settings.update({Key: "Username"}, {Key: "Username", Value: username}, options);
	this.settings.update({Key: "Password"}, {Key: "Password", Value: password}, options);

	callback(null);
};