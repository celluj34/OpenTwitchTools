$(function() {
	window.socket = io.connect("127.0.0.1:18044");

	$("#loginModal").modal();

	initializeCommunication();
	initializeHandlers();
	initializeKnockout();
});

function initializeCommunication() {
	$.get("/emotes", function(data) {
		window.emoteSet = data;
		$("#loadingEmotesMessage").hide();
		$("#successEmotesMessage").show().delay(7500).fadeOut("slow");
	}, "json");

	$.get("/loginInfo", function(data) {
		$("#username").val(data.username);
		$("#password").val(data.password);

		_.each(data.channels, function(item) {
			$("#channel").append($("<option></option>").attr("value", item).text(item));
		});

		$("#channel").select2();
	}, "json");
}

function initializeHandlers() {
	$("#getAuthButton").click(function() {
		$("#authTokenModal").modal();
	});

	$("#loginForm").submit(function(event) {
		event.preventDefault();

		var submitData = {
			username: $("#username").val(),
			password: $("#password").val(),
			channel: $("#channel").val()
		};

		$.post("/", submitData).done(function(data) {
			if(!data.isValid) {
				alert(data.error);
			}
			else {
				$("#loginModal").modal("hide");
				$("#chatContent").show();
				window.viewModel.joinChannel(data.channel);
			}
		});
	});

	$("#chatForm").submit(function(event) {
		window.socket.emit("outgoingMessage", $("#chatMessage").val());
		$("#chatMessage").val(null);
		event.preventDefault();
	});

	socket.on("incomingMessage", function(data) {
		window.viewModel.addComment(data);
	});
}

function initializeKnockout() {
	var commentViewModel = function(data, channelBadges) {
		var self = this;

		self.Name = data.name;
		self.Color = data.color;
		self.Message = parseMessage(data.message, data.emote_set);
		self.Badges = parseAttributes(data.attributes, channelBadges);
	};

	var channelViewModel = function(data, selectedChannel) {
		var self = this;

		self.ChannelName = data;
		self.Comments = ko.observableArray();
		self.Badges = [];

		self.Selected = ko.computed(function() {
			return self === selectedChannel();
		}, self);

		self.addComment = function(comment) {
			self.Comments.unshift(new commentViewModel(comment, self.Badges));

			if(self.Comments().length > 100) {
				self.Comments.pop();
			}
		};
	};

	var windowViewModel = function() {
		var self = this;

		self.OutgoingMessage = ko.observable();
		self.Channels = ko.observableArray();
		self.SelectedChannel = ko.observable();

		self.addComment = function(data) {
			var channelName = data.channel.replace("#", "");
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === channelName;
			});

			matchingChannel.addComment(data);
		};

		self.joinChannel = function(data) {
			var newChannel = new channelViewModel(data, self.SelectedChannel);
			self.Channels.push(viewModel);
			self.SelectedChannel(newChannel);
			getBadges(data);
		};

		self.setBadges = function(data) {
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === data.channel;
			});

			matchingChannel.Badges = data.badges;
		};
	};

	window.viewModel = new windowViewModel();
	ko.applyBindings(viewModel, document.getElementById("chatContent"));
}

function getBadges(channelName) {
	$.get("/badges", {channel: channelName}, function(data) {
		window.viewModel.setBadges(data);
	}, "json");
}

function parseMessage(message, availableEmotes) {
	if(!window.emoteSet) {
		return message;
	}

	var newWords = [];
	var tempWords;
	var emoteList;

	if(availableEmotes.length === 0) {
		emoteList = [];
	}
	else {
		emoteList = JSON.parse(availableEmotes);
	}

	_.each(message.split(" "), function(word) {
		tempWords = _.filter(window.emoteSet, function(emote) {
			return word.match(_.unescape(emote.regex)) && (!emote.emoticon_set || _.contains(emoteList, emote.emoticon_set));
		});

		if(tempWords.length === 0) {
			newWords.push(word);
		}
		else if(tempWords.length === 1) {
			newWords.push(tempWords[0].url);
		}
		else {
			tempWords = _.find(tempWords, function(emote) {
				return emote.regex === word || emote.emoticon_set;
			});

			newWords.push(tempWords.url);
		}
	});

	return newWords.join(" ");
}

function parseAttributes(attributes, availableBadges) {
	if(!attributes || attributes.length === 0 || availableBadges.length === 0) {
		return "";
	}

	var attributeString = "";
	_.each(attributes, function(attribute, index, list) {
		var matchingBadge = _.find(availableBadges, function(badge) {
			return badge.role === attribute;
		});

		attributeString = attributeString + "<img alt='" + matchingBadge.role + "' src='" + matchingBadge.url + "' /> ";
	});

	return attributeString;
}