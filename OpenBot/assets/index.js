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
        window.viewModel.Channel(data.channel);
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
    
    $("#commentModal").on("click", "#modalSingleComment a", function (e) {
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
    window.socket = io.connect("127.0.0.1:18077");

    window.socket.on("incomingMessage", function(data) {
        var scroll = shouldScroll();

        window.viewModel.addComment(data, scroll);

        if(scroll) {
            window.scrollTo(0, document.body.scrollHeight);

            $("#chatMessage").atwho("reposition");
        }
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

    var windowViewModel = function() {
        var self = this;

        //login information
        self.Username = ko.observable();
        self.Password = ko.observable();
        self.Channel = ko.observable();

        //chat information
        self.Comments = ko.observableArray();
        self.MaxComments = ko.observable(100);
        self.SelectedComment = ko.observable();
        self.AlreadyClicked = ko.observable(false);
        self.Users = ko.observableArray();

        //settings and stuff
        self.Keywords = ko.observableArray();
        self.PersonalCommands = ko.observableArray();
        self.TokenAuthUrl = "http://sharpbot.azurewebsites.net/"; // "https://twitchtokenauth.azurewebsites.net/OpenBot";
        self.TokenAuthLoading = ko.observable(true);

        //input information
        self.OutgoingMessage = ko.observable();
        self.NewKeyword = ko.observable();
        self.NewPersonalCommand = ko.observable();
        self.NewPersonalCommandText = ko.observable();

        self.Brand = ko.computed(function() {
            if(self.Channel()) {
                return "#" + self.Channel();
            }

            return "";
        });

        //modals
        self.showTokenAuthModal = function() {
            $("#tokenAuthModal").modal("show");
        };

        self.showKeywordModal = function() {
            $("#keywordModal").modal("show");
        };

        self.showPersonalCommandModal = function() {
            $("#personalCommandModal").modal("show");
        };

        self.showUsers = function() {
            var url = "/users?channel=" + self.Channel();

            $("#usersTable").DataTable().ajax.url(url).load();

            $("#usersModal").modal("show");
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
                    $("#loginModal").modal("hide");
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