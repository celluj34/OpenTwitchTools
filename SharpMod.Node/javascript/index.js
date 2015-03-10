$(function() {
	window.socket = io.connect("127.0.0.1:18044");

	$("#loginModal").modal();

	initializeCommunication();
	initializeHandlers();
	initializeKnockout();
});

function initializeCommunication() {
	$.get("/loginInfo", function(data) {
		$("#username").val(data.username);
		$("#password").val(data.password);

		var channels = $("#channel");
		var newChannels = $("#newChannel");
		_.each(data.channels, function(item) {
			channels.append($("<option/>", {
				value: item,
				text: item
			}));

			newChannels.append($("<option/>", {
				value: item,
				text: item
			}));
		});

		$("#channel").select2();
		$("#newChannel").select2();
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
				window.viewModel.joinChannel(data.channel);

				$("#loginModal").modal("hide");
				$(".body-content").show();
			}
		});
	});

	$("#joinChannelForm").submit(function(event) {
		event.preventDefault();

		var channel = $("#newChannel").val();
		if(channel) {
			window.viewModel.joinChannel(channel);

			$("#newChannel").val(null);
			$("#joinChannelModal").modal("hide");
		}
	});

	socket.on("incomingMessage", function(data) {
		window.viewModel.addComment(data);
		window.scrollTo(0, document.body.scrollHeight);
	});

	socket.on("channelJoined", function(data) {
		window.viewModel.joinChannel(data.channel);
	});
}

function initializeKnockout() {
	var commentViewModel = function(data, channelBadges) {
		var self = this;

		self.Name = data.name;
		self.Color = data.color;
		self.Message = data.message;
		self.Badges = parseAttributes(data.attributes, channelBadges);

		self.showComment = function() {
			window.viewModel.SelectedComment(self);
			$("#commentModal").modal("show");
		};

		self.ban = function() {
			alert("ban " + self.Name);
		};

		self.timeout = function() {
			alert("timeout " + self.Name);
		};

		self.op = function() {
			alert("mod " + self.Name);
		};

		self.deop = function() {
			alert("unmod " + self.Name);
		};
	};

	var channelViewModel = function(data, selectedChannel) {
		var self = this;

		self.ChannelName = data;
		self.Comments = ko.observableArray();
		self.Badges = [];

		self.Selected = ko.computed(function() {
			return this === selectedChannel();
		}, this);

		self.addComment = function(comment) {
			self.Comments.push(new commentViewModel(comment, self.Badges));

			if(self.Comments().length > 100) {
				self.Comments.shift();
			}
		};
	};

	var windowViewModel = function() {
		var self = this;

		self.OutgoingMessage = ko.observable();
		self.Channels = ko.observableArray();
		self.SelectedChannel = ko.observable();
		self.SelectedComment = ko.observable();

		self.addComment = function(data) {
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === data.channel;
			});

			if(matchingChannel) {
				matchingChannel.addComment(data);
			}
		};

		self.joinChannel = function(channelToJoin) {
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === channelToJoin;
			});

			if(!matchingChannel) {
				$("#newChannel [value='" + channelToJoin + "']").remove();
				$("#newChannel").select2();

				var newChannel = new channelViewModel(channelToJoin, self.SelectedChannel);
				self.Channels.push(newChannel);
				self.SelectedChannel(newChannel);
				getBadges(channelToJoin);

				window.socket.emit("joinChannel", {
					channel: channelToJoin
				});
			}
		};

		self.leaveChannel = function(channelToLeave) {
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === channelToLeave;
			});

			if(matchingChannel) {
				//$("#newChannel [value='" + channelToJoin + "']").append();
				//$("#newChannel").select2();

				self.Channels.remove(matchingChannel);
			}
		};

		self.sendMessage = function() {
			if(self.OutgoingMessage().length > 0) {
				window.socket.emit("outgoingMessage", {
					message: self.OutgoingMessage(),
					channel: self.SelectedChannel().ChannelName
				});

				self.OutgoingMessage("");
			}
		};

		self.setBadges = function(data) {
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === data.channel;
			});

			if(matchingChannel) {
				matchingChannel.Badges = data.badges;
			}
		};
	};

	window.viewModel = new windowViewModel();
	ko.applyBindings(viewModel);

	$("#joinChannel").click(function() {
		$("#joinChannelModal").modal();
	});
}

function getBadges(channel) {
	$.get("/badges", {channel: channel}, function(data) {
		window.viewModel.setBadges(data);
	}, "json");
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