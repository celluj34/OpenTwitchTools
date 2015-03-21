SettingsProvider = function(database) {
	this.settings = database.settings;
};

SettingsProvider.prototype.settings = null;

// Public Properties

SettingsProvider.prototype.Username = function() {
	return single(this.settings, "Username");
};

SettingsProvider.prototype.Password = function() {
	return single(this.settings, "Password");
};

// Public Methods

SettingsProvider.prototype.saveLogin = function(_, username, password, callback) {
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