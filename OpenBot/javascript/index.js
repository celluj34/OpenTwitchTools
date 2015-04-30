$(function() {
	showModal("loginModal");

	$(".collapse.navbar-collapse").on("click", ".autoClose", function() {
		$(".collapse.navbar-collapse").collapse("hide");
	});

	$(".collapse.navbar-collapse").on("click", ".channelClose", function() {
		window.scrollTo(0, document.body.scrollHeight);
	});

	loadInfo();
	setupSocketHandlers();
	initializeKnockout();
});

function loadInfo() {
	$.get("/loginInfo", function(data) {
		window.viewModel.Username(data.username);
		window.viewModel.Password(data.password);
		window.viewModel.Channel(data.channel);
	}, "json");

	$.get("/keywords", function(data) {
		window.viewModel.Keywords(data.keywords);
	}, "json");
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

	window.socket.on("userTimeout", function(data) {
		window.viewModel.userTimeout(data);
	});
}

function initializeKnockout() {
	var commentViewModel = function(data) {
		var self = this;

		self.Name = data.name;
		self.Color = data.color;
		self.Message = data.message;
		self.Badges = data.badges;
		self.Timestamp = data.timestamp;
		self.Highlight = data.highlight;
		self.MessageColor = data.isAction ? data.color : "inherit";
		self.Hidden = ko.observable(false);

		self.showComment = function() {
			window.viewModel.setComment(self);
		};

		self.closeComment = function() {
			window.viewModel.unsetComment();
		};

		self.timeout = function(seconds) {
			doAction("timeoutUser", {seconds: seconds});
		};

		self.ban = function() {
			doAction("banUser");
		};

		self.unban = function() {
			doAction("unbanUser");
		};

		self.op = function() {
			doAction("mod");
		};

		self.deop = function() {
			doAction("unmod");
		};

		function doAction(action, properties) {
			var sendData = {
				user: self.Name,
				channel: window.viewModel.Channel()
			};

			$.extend(sendData, properties);

			window.socket.emit(action, sendData);

			self.closeComment();
		}
	};

	var windowViewModel = function() {
		var self = this;

		//login information
		self.Username = ko.observable();
		self.Password = ko.observable();
		self.Channel = ko.observable();

		//chat information
		self.Keywords = ko.observableArray();
		self.SelectedComment = ko.observable();
		self.AlreadyClicked = ko.observable(false);
		self.TokenAuthUrl = "http://sharpbot.azurewebsites.net/";

		//channel information
		self.Comments = ko.observableArray();
		self.MaxComments = ko.observable(100);

		//input information
		self.NewKeyword = ko.observable();
		self.OutgoingMessage = ko.observable();

		//modals
		self.showTokenAuthModal = function() {
			showModal("tokenAuthModal");
		};

		self.showKeywordModal = function() {
			showModal("keywordModal");
		};

		self.showUsers = function() {
			alert("This feature is currently in development. 'Show users for " + self.Channel() + "'.");
			//showModal("usersModal");
		};

		//functions
		self.login = function() {
			var submitData = {
				username: self.Username().toLowerCase(),
				password: self.Password().toLowerCase(),
				channel: self.Channel().toLowerCase()
			};

			$.post("/", submitData).done(function(data) {
				if(!data.isValid) {
					alert(data.error);
				}
				else {
					hideModal("loginModal");
				}
			});
		};

		self.addComment = function(data, scroll) {
			self.Comments.push(new commentViewModel(data));
			var length = self.Comments().length;

			if(scroll && length > self.MaxComments()) {
				self.Comments.splice(0, length - self.MaxComments());
			}
		};

		self.addKeyword = function() {
			var keyword = self.NewKeyword();
			self.NewKeyword(null);

			$.ajax({
				url: "/keywords",
				type: "PUT",
				data: {keyword: keyword},
				success: function() {
                    self.Keywords.push(keyword);
				}
			});
		};

		self.removeKeyword = function(word) {
			$.ajax({
				url: "/keywords",
				type: "DELETE",
				data: {keyword: word},
				success: function() {
                    self.Keywords.remove(word);
				}
			});
		};

		self.userTimeout = function(data) {
			_.each(self.Comments(), function(comment) {
				if(comment.Name === data.user) {
					comment.Hidden(true);
				}
			});
		};

		self.sendMessage = function() {
			if(self.OutgoingMessage().length > 0) {
				window.socket.emit("outgoingMessage", {
					message: self.OutgoingMessage(),
					channel: self.Channel()
				});

				self.OutgoingMessage("");
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
			hideModal("commentModal");
		};
	};

	window.viewModel = new windowViewModel();
	ko.applyBindings(window.viewModel);
}

//function getUsers(channel) {
//	$.get("/users", {channel: channel}, function(data) {
//		window.viewModel.setUsers(data);
//	}, "json");
//}

function showModal(modal) {
	$("#" + modal).modal("show");
	$("body").css("padding-right", 0);
}

function hideModal(modal) {
	$("#" + modal).modal("hide");
	$("body").css("padding-right", 0);
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