$(function() {
    $("#joinChannelModal").modal("show");

    setupCustomControls();
    initializeKnockout();
});

function setupCustomControls() {
    $(".collapse.navbar-collapse").on("click", ".autoClose", function() {
        $(".collapse.navbar-collapse").collapse("hide");
    });

    $(".collapse.navbar-collapse").on("click", ".channelClose", function() {
        window.scrollTo(0, document.body.scrollHeight);
    });

    $("[data-toggle='tooltip']").tooltip();

    //$("#webview-control").on("dom-ready", function() {
    //    window.viewModel.TokenAuthLoading(false);
    //});

    $("#newChannel").select2({
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
    });
}

function initializeKnockout() {
    var channelViewModel = function(data) {
        var self = this;

        //channel static properties
        self.Name = data;

        //observable properties
        self.Selected = ko.observable(false);

        //computed properties
        self.Brand = ko.computed(function() {
            return "#" + self.Name;
        });

        self.EmbedUrl = ko.computed(function() {
            return "http://www.twitch.tv/" + self.Name + "/embed";
        });

        self.EmbedId = ko.computed(function() {
            return self.Name + "player";
        });

        self.Selector = ko.computed(function() {
            return "#" + self.EmbedId();
        });
    };

    var windowViewModel = function() {
        var self = this;

        //observable properties
        self.LoginSelectedChannel = ko.observable();

        //chat information
        self.Channels = ko.observableArray();

        //computed properties
        self.SelectedChannel = ko.computed(function() {
            return _.find(self.Channels(), function(channel) {
                return channel.Selected();
            });
        });

        self.ChannelIsSelected = ko.computed(function() {
            return !_.isUndefined(self.SelectedChannel());
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

                var player = $(channel.Selector())[0];

                if(channel.Selected()) {
                    player.playVideo();
                }
                else {
                    player.pauseVideo();
                }
            });
        };

        self.showJoinChannelModal = function() {
            $("#joinChannelModal").modal("show");
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

        self.leaveChannel = function() {
            self.Channels.remove(self.SelectedChannel());
            var firstChannel = _.first(self.Channels());

            if(!_.isUndefined(firstChannel)) {
                self.Select(firstChannel.Name);
            }
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

            var newChannel = new channelViewModel(selectedChannel);
            self.Channels.push(newChannel);
            self.Select(newChannel.Name);
        }
    };

    window.viewModel = new windowViewModel();
    ko.applyBindings(window.viewModel);
}