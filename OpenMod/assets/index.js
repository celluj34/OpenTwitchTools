$(function() {
    $("#loginModal").modal("show");

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
        window.viewModel.Keywords(data);
    }, "json");

    $.get("/personalCommands", function(data) {
        window.viewModel.PersonalCommands(data);
    }, "json");
}

function setupCustomControls() {
    $(".collapse.navbar-collapse").on("click", ".autoClose", function() {
        $(".collapse.navbar-collapse").collapse("hide");
    });

    $(".collapse.navbar-collapse").on("click", ".channelClose", function() {
        window.scrollTo(0, document.body.scrollHeight);
    });

    $("#commentModal").on("click", "#modalSingleComment a", function(e) {
        e.preventDefault();

        var url = $(this).attr("href");
        
        window.socket.emit("openLink", {
            url: url
        });
    });

    $("[data-toggle='tooltip']").tooltip();

    $("#webview-control")[0].addEventListener("dom-ready", function() {
        window.viewModel.TokenAuthLoading(false);
    });

    $("#usersTable").DataTable({
        columns: [
            {
                title: "User",
                data: "user",
                class: "col-sm-6"
            },
            {
                title: "Type",
                data: "type",
                class: "col-sm-6"

            }
        ],
        dom: "frt<\"text-center\"i>p"
    });

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
                        channel: window.viewModel.SelectedChannel().Name,
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
            displayTpl: "<li>${id} - ${preview}</li>",
            insertTpl: "${value}",
            searchKey: "id"
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
    var commentViewModel = function(data, channel) {
        var self = this;

        //comment static properties
        self.Name = data.name;
        self.Color = data.color;
        self.Message = data.message;
        self.Badges = data.badges;
        self.Timestamp = data.timestamp;
        self.Highlight = data.highlight;
        self.Action = data.isAction;
        self.Channel = channel;

        self.HighlightColor = self.Highlight ? "bg-danger" : "";

        //observable properties
        self.Hidden = ko.observable(false);

        //computed fields
        self.ChatMessage = ko.computed(function() {
            if(self.Hidden()) {
                return "<i>message deleted. click to view.</i>";
            }

            return self.Message;
        });

        self.ChatColor = ko.computed(function() {
            if(!self.Hidden() && self.Action) {
                return self.Color;
            }

            return "inherit";
        });

        self.DetailColor = ko.computed(function() {
            if(self.Action) {
                return self.Color;
            }

            return "inherit";
        });

        //comment functions
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
                channel: self.Channel
            };

            $.extend(sendData, properties);

            window.socket.emit(action, sendData);

            self.closeComment();
        }
    };

    var channelViewModel = function(data) {
        var self = this;

        //channel static properties
        self.Name = data;
        self.Brand = "#" + data;

        //observable properties
        self.Comments = ko.observableArray();
        self.MaxComments = ko.observable(100);
        self.Joined = ko.observable(false);
        self.Selected = ko.observable(false);

        //channel functions
        self.addComment = function(comment, scroll) {
            self.Comments.push(new commentViewModel(comment, self.Name));
            var length = self.Comments().length;

            if(scroll && length > self.MaxComments()) {
                self.Comments.splice(0, length - self.MaxComments());
            }
        };

        self.timeout = function(user) {
            _.chain(self.Comments())
                .where({Name: user})
                .each(function(comment) {
                    comment.Hidden(true);
                });
        };
    };

    var windowViewModel = function() {
        var self = this;

        //login information
        self.Username = ko.observable();
        self.Password = ko.observable();
        self.LoginSelectedChannel = ko.observable();

        //chat information
        self.Channels = ko.observableArray();
        self.SelectedComment = ko.observable();
        self.AlreadyClicked = ko.observable(false);

        //settings and stuff
        self.Keywords = ko.observableArray();
        self.PersonalCommands = ko.observableArray();
        self.TokenAuthUrl = "http://sharpmod.azurewebsites.net/"; // "https://twitchtokenauth.azurewebsites.net/OpenMod";
        self.TokenAuthLoading = ko.observable(true);

        //input information
        self.OutgoingMessage = ko.observable();
        self.NewKeyword = ko.observable();
        self.NewPersonalCommand = ko.observable();
        self.NewPersonalCommandText = ko.observable();

        //computed values
        self.SelectedChannel = ko.computed(function() {
            var selectedChannel = _.find(self.Channels(), function(channel) {
                return channel.Selected();
            });

            if(_.isUndefined(selectedChannel)) {
                return null;
            }

            return selectedChannel;
        });

        self.ChannelIsSelected = ko.computed(function() {
            return !_.isNull(self.SelectedChannel());
        });

        self.Brand = ko.computed(function() {
            if(self.ChannelIsSelected()) {
                return self.SelectedChannel().Brand;
            }

            return "";
        });

        //functions
        self.Select = function(channelName) {
            _.each(self.Channels(), function(channel) {
                channel.Selected(channel.Name === channelName);
            });
        };

        self.showTokenAuthModal = function() {
            $("#tokenAuthModal").modal("show");
        };

        self.showJoinChannelModal = function() {
            $("#joinChannelModal").modal("show");
        };

        self.showKeywordModal = function() {
            $("#keywordModal").modal("show");
        };

        self.showPersonalCommandModal = function() {
            $("#personalCommandModal").modal("show");
        };

        self.showUsers = function() {
            var url = "/users?channel=" + self.SelectedChannel().Name;

            $("#usersTable").DataTable().ajax.url(url).load();

            $("#usersModal").modal("show");
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
                        self.Keywords.push({value: self.NewKeyword()});
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
                        self.Keywords.remove(function(item) {
                            return item.value === keyword;
                        });
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
                data: {
                    id: self.NewPersonalCommand(),
                    value: self.NewPersonalCommandText()
                },
                success: function(result) {
                    if(result.isValid) {
                        self.PersonalCommands.push({
                            id: self.NewPersonalCommand(),
                            value: self.NewPersonalCommandText()
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
                data: {id: command},
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

                var matchingChannel = findMatchingChannel(selectedChannel);

                if(!matchingChannel) {
                    addChannel(selectedChannel);
                }

                self.Select(selectedChannel);
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
                channel: self.SelectedChannel().Name
            });

            self.Channels.remove(self.SelectedChannel());
            var firstChannel = _.first(self.Channels());

            if(!_.isUndefined(firstChannel)) {
                self.Select(firstChannel.Name);
            }
        };

        self.sendMessage = function() {
            if(self.OutgoingMessage().length > 0) {
                window.socket.emit("outgoingMessage", {
                    message: self.OutgoingMessage(),
                    channel: self.SelectedChannel().Name
                });

                self.OutgoingMessage(null);
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

        function findMatchingChannel(channelName) {
            return _.find(self.Channels(), function(channel) {
                return channel.Name === channelName;
            });
        }

        function addChannel(selectedChannel) {
            if(!selectedChannel) {
                return;
            }

            window.socket.emit("joinChannel", {
                channel: selectedChannel
            });

            var newChannel = new channelViewModel(selectedChannel);
            self.Channels.push(newChannel);
            self.Select(newChannel.Name);
        }
    };

    window.viewModel = new windowViewModel();
    ko.applyBindings(window.viewModel);
}

function shouldScroll() {
    var minHeight = document.body.scrollHeight - 40;
    var currentHeight = window.innerHeight + window.pageYOffset;
    var maxHeight = document.body.scrollHeight;

    return (currentHeight - minHeight) * (currentHeight - maxHeight) <= 0;
}