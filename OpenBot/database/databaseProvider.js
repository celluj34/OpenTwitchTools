DatabaseProvider = function(directory, table) {
	var database = require("diskdb");
	var _ = require("underscore");

	database.connect(directory, [table]);

	DatabaseProvider.prototype.database = database[table];
	DatabaseProvider.prototype._ = _;
};

DatabaseProvider.prototype.database = null;
DatabaseProvider.prototype._ = null;

// Public test methods

DatabaseProvider.prototype.Single = function(key) {
	if(isNullOrEmpty(key)) {
		return null;
	}

	var results = this.database.findOne({Key: key});

	if(results) {
		return results.Value;
	}

	return null;
};

DatabaseProvider.prototype.Many = function(key) {
	if(isNullOrEmpty(key)) {
		return [];
	}

	return this.database.find({Key: key});
};

DatabaseProvider.prototype.Update = function(key, value) {
	if(!isNullOrEmpty(key)) {
		this.database.update({Key: key}, {Value: value});
	}
};

DatabaseProvider.prototype.Insert = function(key, value) {
	if(!isNullOrEmpty(key)) {
		this.database.save({Key: key, Value: value});
	}
};

DatabaseProvider.prototype.Upsert = function(key, value) {
	if(isNullOrEmpty(key)) {
		return;
	}

	var results = this.database.findOne({Key: key});

	if(results) {
		this.database.update({Key: key}, {Value: value});
	}
	else {
		this.database.save({Key: key, Value: value});
	}
};

DatabaseProvider.prototype.Remove = function(key, value) {
	if(!isNullOrEmpty(key)) {
		this.database.remove({Key: key, Value: value});
	}
};

// Helper Methods

function isNullOrEmpty(value) {
    var _ = DatabaseProvider.prototype._;

	return _.isUndefined(value) || _.isEmpty(value.trim());
}