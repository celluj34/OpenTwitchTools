$(function() {
    showModal("loginModal");

    $(".collapse.navbar-collapse").on("click", ".autoClose", function() {
        $(".collapse.navbar-collapse").collapse("hide");
    });

    $(".collapse.navbar-collapse").on("click", ".channelClose", function() {
        window.scrollTo(0, document.body.scrollHeight);
    });

    loadInfo();
    setupCustomControls();
    setupSocketHandlers();
    initializeKnockout();
});

function loadInfo() {
    $.get("/loginInfo", function(data) {
        window.viewModel.Username(data.username);
        window.viewModel.Password(data.password);
    }, "json");

    $.get("/keywords", function(data) {
        window.viewModel.Keywords(data.keywords);
    }, "json");

    $.get("/personalCommands", function(data) {
        window.viewModel.PersonalCommands(data);
    }, "json");
}

function setupCustomControls() {
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
        allowClear: true,
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

    $("#chatMessage").atwho({
            at: "@",
            displayTimeout: 300,
            callbacks: {
                remoteFilter: function(query, callback) {
                    $.post("/users", {
                        channel: window.viewModel.SelectedChannel().ChannelName,
                        query: query
                    }, function(data) {
                        callback(data);
                    });
                }
            }
        })
        .atwho({
            at: "!",
            displayTimeout: 300,
            callbacks: {
                remoteFilter: function(query, callback) {
                    $.post("/personalCommands", {
                        query: query
                    }, function(data) {
                        callback(data);
                    });
                }
            },
            displayTpl: "<li>${id} - ${name}</li>",
            insertTpl: "${name}"
        });

    //.atwho({
    //    at: "$",
    //    displayTimeout: 300,
    //    callbacks: {
    //        remoteFilter: function (query, callback) {
    //            $.get("/emotes", {
    //                query: query
    //            }, function (data) {
    //                callback(data);
    //            });
    //        }
    //    }
    //});
}

function setupSocketHandlers() {
    window.socket = io.connect("127.0.0.1:18044");

    window.socket.on("incomingMessage", function(data) {
        var scroll = shouldScroll();

        window.viewModel.addComment(data, scroll);

        if(scroll) {
            window.scrollTo(0, document.body.scrollHeight);

            $("#chatMessage").atwho("reposition");
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
                channel: window.viewModel.SelectedChannel().ChannelName
            };

            $.extend(sendData, properties);

            window.socket.emit(action, sendData);

            self.closeComment();
        }
    };

    var channelViewModel = function(data, selectedChannel) {
        var self = this;

        self.ChannelName = data;
        self.Comments = ko.observableArray();
        self.MaxComments = ko.observable(100);
        self.Joined = ko.observable(false);

        self.Selected = ko.computed(function() {
            return this === selectedChannel();
        }, this);

        self.addComment = function(comment, scroll) {
            self.Comments.push(new commentViewModel(comment));
            var length = self.Comments().length;

            if(scroll && length > self.MaxComments()) {
                self.Comments.splice(0, length - self.MaxComments());
            }
        };

        self.timeout = function(user) {
            _.each(self.Comments(), function(comment) {
                if(comment.Name === user) {
                    comment.Hidden(true);
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
        self.PersonalCommands = ko.observableArray();
        self.ChannelIsSelected = ko.observable(false);
        self.SelectedChannel = ko.observable({});
        self.SelectedComment = ko.observable();
        self.AlreadyClicked = ko.observable(false);
        self.TokenAuthUrl = "http://sharpmod.azurewebsites.net/"; // "https://twitchtokenauth.azurewebsites.net/OpenMod";

        //input information
        self.LoginSelectedChannel = ko.observable();
        self.NewKeyword = ko.observable();
        self.NewPersonalCommand = ko.observable();
        self.NewPersonalCommandText = ko.observable();

        self.showTokenAuthModal = function() {
            showModal("tokenAuthModal");
        };

        self.showJoinChannelModal = function() {
            showModal("joinChannelModal");
        };

        self.showKeywordModal = function() {
            showModal("keywordModal");
        };

        self.showPersonalCommandModal = function() {
            showModal("personalCommandModal");
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
            }

            $.post("/", submitData).done(function(data) {
                if(!data.isValid) {
                    alert(data.error);
                }
                else {
                    addChannel(selectedChannel);

                    $("#loginModal").modal("hide");

                    self.LoginSelectedChannel("");
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
            $.ajax({
                url: "/keywords",
                type: "PUT",
                data: {keyword: self.NewKeyword()},
                success: function(result) {
                    if(result.isValid) {
                        self.Keywords.push(self.NewKeyword());
                        self.NewKeyword(null);
                    }
                    else {
                        alert(result.error);
                    }
                }
            });
        };

        self.removeKeyword = function(keyword) {
            $.ajax({
                url: "/keywords",
                type: "DELETE",
                data: {keyword: keyword},
                success: function(result) {
                    if(result.isValid) {
                        self.Keywords.remove(keyword);
                    }
                    else {
                        alert(result.error);
                    }
                }
            });
        };

        self.addPersonalCommand = function() {
            $.ajax({
                url: "/personalCommands",
                type: "PUT",
                data: {command: command},
                success: function(result) {
                    if(result.isValid) {
                        self.PersonalCommands.push({
                            id: self.NewPersonalCommand(),
                            text: self.NewPersonalCommandText()
                        });

                        self.NewPersonalCommand(null);
                        self.NewPersonalCommandText(null);
                    }
                    else {
                        alert(result.error);
                    }
                }
            });
        };

        self.removePersonalCommand = function(command) {
            $.ajax({
                url: "/personalCommands",
                type: "DELETE",
                data: {command: command},
                success: function(result) {
                    if(result.isValid) {
                        self.PersonalCommands.remove(function(item) {
                            return item.id === command;
                        });
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
                matchingChannel.timeout(data.name);
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
            self.ChannelIsSelected(true);
        }
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