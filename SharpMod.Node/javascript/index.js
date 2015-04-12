$(function() {
	showModal("loginModal");

	$(".collapse.navbar-collapse").on("click", ".autoClose", function() {
		$(".collapse.navbar-collapse").collapse("hide");
	});

	$(".collapse.navbar-collapse").on("click", ".channelClose", function() {
		window.scrollTo(0, document.body.scrollHeight);
	});

	getLoginInfo();
	setupSocketHandlers();
	initializeKnockout();
});

function getLoginInfo() {
	$.get("/loginInfo", function(data) {
		window.viewModel.Username(data.username);
		window.viewModel.Password(data.password);
	}, "json");

	$.get("/keywords", function(data) {
		window.viewModel.Keywords(data.keywords);
	}, "json");

	var select2Settings = {
		ajax: {
			delay: 200,
			dataType: "json",
			url: "/search",
			data: function(params) {
				return {
					channel: params.term,
					page: params.page
				};
			},
			method: "POST",
			processResults: function(data) {
				return {
					results: data
				};
			}
		},
		minimumInputLength: 4,
		placeholder: {
			name: "Search",
			id: null
		},
		templateResult: function(channel) {
			return channel.name;
		},
		templateSelection: function(channel) {
			return channel.name;
		},
		escapeMarkup: function(markup) {
			return markup;
		},
		id: function(channel) {
			return channel.id;
		}
	};

	$("#channel").select2(select2Settings);
	$("#newChannel").select2(select2Settings);
}

function setupSocketHandlers() {
	window.socket = io.connect("127.0.0.1:18044");

	window.socket.on("incomingMessage", function(data) {
		var scroll = shouldScroll();

		window.viewModel.addComment(data, scroll);

		if(scroll) {
			window.scrollTo(0, document.body.scrollHeight);
		}
	});

	window.socket.on("channelJoined", function(data) {
		window.viewModel.channelJoined(data);
	});

	window.socket.on("userTimeout", function(data) {
		window.viewModel.userTimeout(data);
	});
}

function initializeKnockout() {
	var commentViewModel = function(data, channelBadges) {
		var self = this;

		self.Name = data.name;
		self.Color = data.color;
		self.Message = data.message;
		self.Action = data.action;
		self.Badges = parseAttributes(data.attributes, channelBadges);
		self.Timestamp = getTimestamp();
		self.Timeout = ko.observable(false);

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
		self.MaxComments = ko.observable(100);
		self.Joined = ko.observable(false);
		self.Badges = [];

		self.Selected = ko.computed(function() {
			return this === selectedChannel();
		}, this);

		self.addComment = function(comment, scroll) {
			self.Comments.push(new commentViewModel(comment, self.Badges));
			var length = self.Comments().length;

			if(scroll && length > self.MaxComments()) {
				self.Comments.splice(0, length - self.MaxComments());
			}
		};

		self.timeout = function(user) {
			_.each(self.Comments(), function(comment) {
				if(comment.Name === user) {
					comment.Timeout(true);
				}
			});
		};
	};

	var windowViewModel = function() {
		var self = this;

		//login information
		self.Username = ko.observable();
		self.Password = ko.observable();

		//chat information
		self.OutgoingMessage = ko.observable("");
		self.Channels = ko.observableArray();
		self.Keywords = ko.observableArray();
		self.ChannelIsSelected = ko.observable(false);
		self.SelectedChannel = ko.observable({});
		self.SelectedComment = ko.observable();
		self.AlreadyClicked = ko.observable(false);
		self.TokenAuthUrl = "http://sharpmod.azurewebsites.net/";

		//input information
		self.LoginSelectedChannel = ko.observable();
		self.NewKeyword = ko.observable();

		self.showTokenAuthModal = function() {
			showModal("tokenAuthModal");
		};

		self.showJoinChannelModal = function() {
			showModal("joinChannelModal");
		};

		self.showKeywordModal = function() {
			showModal("keywordModal");
		};

		self.showUsers = function() {
			alert("This feature is currently in development. 'Show users for " + self.SelectedChannel().ChannelName + "'.");
			//showModal("usersModal");
		};

		self.login = function() {
			var selectedChannel = self.LoginSelectedChannel();

			var submitData = {
				username: self.Username().toLowerCase(),
				password: self.Password().toLowerCase()
			};

			if(self.LoginSelectedChannel()) {
				submitData.channel = selectedChannel.toLowerCase();
				self.LoginSelectedChannel("");
			}

			$.post("/", submitData).done(function(data) {
				if(!data.isValid) {
					alert(data.error);
				}
				else {
					addChannel(selectedChannel);

					$("#loginModal").modal("hide");
				}
			});
		};

		self.addComment = function(data, scroll) {
			var matchingChannel = findMatchingChannel(data.channel);

			if(matchingChannel) {
				matchingChannel.addComment(data, scroll);
			}
		};

		self.addKeyword = function() {
			var keyword = self.NewKeyword();
			self.NewKeyword(null);

			$.ajax({
				url: "/keywords",
				type: "PUT",
				data: {keyword: keyword},
				success: function(result) {
					if(result.isValid) {
						self.Keywords.push(keyword);
					}
					else {
						alert(result.error);
					}
				}
			});
		};

		self.removeKeyword = function(word) {
			$.ajax({
				url: "/keywords",
				type: "DELETE",
				data: {keyword: word},
				success: function(result) {
					if(result.isValid) {
						self.Keywords.remove(word);
					}
					else {
						alert(result.error);
					}
				}
			});
		};

		self.joinChannel = function() {
			if(self.LoginSelectedChannel()) {
				$("#joinChannelModal").modal("hide");

				var selectedChannel = self.LoginSelectedChannel().toLowerCase();
				self.LoginSelectedChannel("");

				var matchingChannel = findMatchingChannel(selectedChannel);

				if(!matchingChannel) {
					addChannel(selectedChannel);

					window.socket.emit("joinChannel", {
						channel: selectedChannel
					});
				}
			}
		};

		self.channelJoined = function(data) {
			var matchingChannel = findMatchingChannel(data.channel);

			if(matchingChannel) {
				matchingChannel.Joined(true);
			}
		};

		self.userTimeout = function(data) {
			var matchingChannel = findMatchingChannel(data.channel);

			if(matchingChannel) {
				matchingChannel.timeout(data.user);
			}
		};

		self.leaveChannel = function() {
			window.socket.emit("leaveChannel", {
				channel: self.SelectedChannel().ChannelName
			});

			self.Channels.remove(self.SelectedChannel());
			var firstChannel = _.first(self.Channels());

			if(firstChannel) {
				self.SelectedChannel(firstChannel);
				self.ChannelIsSelected(true);
			}
			else {
				self.SelectedChannel({});
				self.ChannelIsSelected(false);
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
			var matchingChannel = findMatchingChannel(data.channel);

			if(matchingChannel) {
				matchingChannel.Badges = data.badges;
			}
		};

		self.setComment = function(comment) {
			if(!self.AlreadyClicked()) {
				self.SelectedComment(comment);
				self.AlreadyClicked(true);
				showModal("commentModal");
			}
		};

		self.unsetComment = function() {
			self.SelectedComment(null);
			self.AlreadyClicked(false);
			$("#commentModal").modal("hide");
		};

		function findMatchingChannel(channelName) {
			return _.find(self.Channels(), function(channel) {
				return channel.ChannelName === channelName;
			});
		}

		function addChannel(selectedChannel) {
			if(!selectedChannel) {
				return;
			}

			var newChannel = new channelViewModel(selectedChannel, self.SelectedChannel);
			self.Channels.push(newChannel);
			self.SelectedChannel(newChannel);
			getBadges(selectedChannel);
			self.ChannelIsSelected(true);
		}
	};

	window.viewModel = new windowViewModel();
	ko.applyBindings(window.viewModel);
}

function getBadges(channel) {
	$.get("/badges", {channel: channel}, function(data) {
		window.viewModel.setBadges(data);
	}, "json");
}

//function getUsers(channel) {
//	$.get("/users", {channel: channel}, function(data) {
//		window.viewModel.setUsers(data);
//	}, "json");
//}

function parseAttributes(attributes, availableBadges) {
	if(!attributes || attributes.length === 0 || availableBadges.length === 0) {
		return "";
	}

	var attributeString = "";
	_.each(attributes, function(attribute) {
		var matchingBadge = _.find(availableBadges, function(badge) {
			return badge.role === attribute;
		});

		attributeString = attributeString + "<img title='" + matchingBadge.role + "' src='" + matchingBadge.url + "' /> ";
	});

	return attributeString;
}

function showModal(modal) {
	$("#" + modal).modal("show");
	$("body").css("padding-right", 0);
}

function getTimestamp() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var period = hours < 12 ? "AM" : "PM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + minutes + "" + period;
}

function getScroll() {
	if(typeof (window.pageYOffset) == "number") {
		//Netscape compliant
		return window.pageYOffset;
	}
	else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
		//DOM compliant
		return document.body.scrollTop;
	}
	else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
		//IE6 standards compliant mode
		return document.documentElement.scrollTop;
	}

	return 0;
}

function getSize() {
	if(typeof (window.innerWidth) == "number") {
		//Non-IE
		return window.innerHeight;
	}
	else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		//IE 6+ in 'standards compliant mode'
		return document.documentElement.clientHeight;
	}
	else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
		//IE 4 compatible
		return document.body.clientHeight;
	}

	return 0;
}

function shouldScroll() {
	var minHeight = document.body.scrollHeight - 40;
	var currentHeight = getSize() + getScroll();
	var maxHeight = document.body.scrollHeight;

	return (currentHeight - minHeight) * (currentHeight - maxHeight) <= 0;
}