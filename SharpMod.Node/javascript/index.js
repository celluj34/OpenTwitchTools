$(function() {
	window.socket = io.connect("127.0.0.1:18044");

	$("#loginModal").modal();

	getLoginInfo();
	setupSocketHandlers();
	initializeKnockout();
});

function getLoginInfo() {
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

function setupSocketHandlers() {
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
		self.Timestamp = getTimestamp();

		self.showComment = function() {
			window.viewModel.setComment(self);
		};

		self.closeComment = function() {
			window.viewModel.unsetComment();
		};

		self.timeout = function(seconds) {
			window.socket.emit("timeoutUser", {
				user: self.Name,
				channel: window.viewModel.SelectedChannel().ChannelName,
				seconds: seconds
			});

			self.closeComment();
		};

		self.ban = function() {
			window.socket.emit("banUser", {
				user: self.Name,
				channel: window.viewModel.SelectedChannel().ChannelName
			});

			self.closeComment();
		};

		self.unban = function() {
			window.socket.emit("unbanUser", {
				user: self.Name,
				channel: window.viewModel.SelectedChannel().ChannelName
			});

			self.closeComment();
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
		self.AlreadyClicked = ko.observable(false);
		self.TokenAuthUrl = "http://sharpmod.azurewebsites.net/";

		self.showTokenAuthModal = function() {
			$("#tokenAuthModal").modal();
		};

		self.login = function() {
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
					self.joinChannel(data.channel);

					$("#loginModal").modal("hide");
					$(".body-content").show();
				}
			});
		};

		self.addComment = function(data) {
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === data.channel;
			});

			if(matchingChannel) {
				matchingChannel.addComment(data);
			}
		};

		self.joinChannel = function() {
			var channelToJoin = $("#newChannel").val();
			if(channelToJoin) {
				$("#newChannel").val(null);
				$("#joinChannelModal").modal("hide");

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
			}
		};

		self.leaveChannel = function(channelToLeave) {
			var matchingChannel = _.find(self.Channels(), function(channel) {
				return channel.ChannelName === channelToLeave;
			});

			if(matchingChannel) {
				// add selection back to select2
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

		self.setComment = function(comment) {
			if(!self.AlreadyClicked()) {
				self.SelectedComment(comment);
				self.AlreadyClicked(true);
				$("#commentModal").modal("show");
			}
		};

		self.unsetComment = function() {
			self.SelectedComment(null);
			self.AlreadyClicked(false);
			$("#commentModal").modal("hide");
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

		attributeString = attributeString + "<img title='" + matchingBadge.role + "' src='" + matchingBadge.url + "' /> ";
	});

	return attributeString;
}

function getTimestamp() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var period = hours < 12 ? "AM" : "PM";

	hours = hours - 12;
	if(minutes < 10) {
		minutes = "0" + minutes;
	}

	return hours + ":" + minutes + period;
}

//e(window.AttachSearchJavaScript = function() {
//	var r = e("#header_search"), i;
//	i = new Date(+(new Date) - 186e4);
//	var s =
//	{
//		engineKey: "9NXQEpmQPwBEz43TM592",
//		searchFields:
//		{live: ["name", "login", "status", "game^2"], users: ["login", "name"], broadcasts: ["title", "game^2", "user"]},
//		fetchFields:
//		{live: ["status", "title", "name", "path"], users: ["name", "path"], broadcasts: ["title", "user", "path"]},
//		functionalBoosts:
//		{
//			live:
//			{followers: "logarithmic"},
//			users:
//			{followers: "logarithmic"},
//			broadcasts:
//			{views: "logarithmic"}
//		},
//		filters:
//		{
//			live:
//			{updated_at: "[" + i.toISOString() + " TO *]"}
//		},
//		resultRenderFunction: t,
//		onComplete: n,
//		suggestionListType: "div",
//		suggestionListClass: "st-autocomplete",
//		resultListSelector: ".result",
//		setWidth: !1,
//		resultLimit: 3
//	};
//	e("input#query", r).swiftype(s), e("div.st-autocomplete").on("click", "div.all", function(e) {
//		r.submit();
//	}).on("mouseover", "div.all", function() {
//		e(".st-autocomplete .active").removeClass("active"), e(this).children(".result").addClass("active");
//	}), e("body").on("autocomplete-small", function() {
//		var t = e("#sidebar_search_small");
//		e("input#sidebar_query_small", t).swiftype(Twitch.defaults(
//		{appendTo: "#flyout .content", suggestionListClass: "st-autocomplete-small"}, s)), e("div.st-autocomplete-small").on("click", "div.all", function(e) {
//			t.submit();
//		}).on("mouseover", "div.all", function() {
//			e(".st-autocomplete-small .active").removeClass("active"), e(this).children(".result").addClass("active");
//		});
//	});
//	var o = e("#sidebar_search");
//	e("input#sidebar_query", o).swiftype(Twitch.defaults(
//	{suggestionListClass: "st-autocomplete-sidebar"}, s)), e("div.st-autocomplete-sidebar").on("click", "div.all", function(e) {
//		o.submit();
//	}).on("mouseover", "div.all", function() {
//		e(".st-autocomplete-sidebar .active").removeClass("active"), e(this).children(".result").addClass("active");
//	});
//});