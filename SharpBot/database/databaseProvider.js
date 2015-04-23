DatabaseProvider = function(directory, table) {
	var database = require("diskdb");
	database.connect(directory, [table]);

	DatabaseProvider.prototype.database = database[table];
};

DatabaseProvider.prototype.database = null;

// Public Properties

DatabaseProvider.prototype.Username = function() {
	return single(this.database, "Username");
};

DatabaseProvider.prototype.Password = function() {
	return single(this.database, "Password");
};

DatabaseProvider.prototype.Keywords = function() {
	return all(this.database, "Keyword");
};

// Public Methods

DatabaseProvider.prototype.saveLogin = function(_, username, password, callback) {
	if(_.isUndefined(username) || _.isEmpty(username.trim())) {
		callback("Username must not be null.");
		return;
	}

	if(_.isUndefined(password) || _.isEmpty(password.trim())) {
		callback("Password must not be null.");
		return;
	}

	this.database.update({Key: "Username"}, {Value: username});
	this.database.update({Key: "Password"}, {Value: password});

	callback(null);
};

DatabaseProvider.prototype.addKeyword = function(_, keyword, callback) {
	var error = null;

	if(_.isUndefined(keyword) || _.isEmpty(keyword.trim())) {
		error = "Keyword must not be empty.";
	}
	else {
		var matchingKeyword = _.where(this.Keywords(), {Value: keyword});

		if(matchingKeyword.length === 0) {
			this.database.save({Key: "Keyword", Value: keyword});
		}
		else {
			error = "Keyword is already defined.";
		}
	}

	callback(error);
};

DatabaseProvider.prototype.removeKeyword = function(_, keyword, callback) {
	var error = null;

	if(_.isUndefined(keyword) || _.isEmpty(keyword.trim())) {
		error = "Keyword must not be empty.";
	}
	else {
		this.database.remove({Key: "Keyword", Value: keyword});
	}

	callback(error);
};

// Helper Methods

function single(database, key) {
	var results = database.findOne({Key: key});
	if(results) {
		return results.Value;
	}

	return null;
}

function all(database, key) {
	return database.find({Key: key});
}