SettingsProvider = function(diskDb) {
	this.database = diskDb;
};

SettingsProvider.prototype.database = null;

SettingsProvider.prototype.Username = function() {
	var findOne = this.database.settings.findOne({Key: "Username"});
	return findOne || "";
};

SettingsProvider.prototype.Password = function() {
	var findOne = this.database.settings.findOne({Key: "Password"});
	return findOne || "";
};

SettingsProvider.prototype.saveLogin = function(username, password, callback) {
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

	this.database.settings.update({Key: "Username", Value: username}, options);
	this.database.settings.update({Key: "Password", Value: password}, options);

	callback(null);
};

exports.SettingsProvider = SettingsProvider;