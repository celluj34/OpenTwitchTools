$(function() {
	initialize();

	//getBadges();

	//$("#chatForm").submit(function(event) {
	//	socket.emit("outgoingMessage", $("#chatMessage").val());
	//	event.preventDefault();
	//	$("#chatMessage").val(null);
	//});

	//socket.on("incomingMessage", function(data) {
	//	//{name: user.username, attributes: user.special, emote_set : user.emote, color: user.color, message: message, channel: incChannel}
	//	//{name               , attributes              , emote_set             , color            , message         , channel            }

	//	var thing = "<div class='panel panel-default comment'>" +
	//		"   <div class='panel-heading'>" +
	//		"       <h3 class='panel-title' style='color: " + data.color + "; font-weight:bold'>" + parseAttributes(data.attributes) + data.name + "</h3>" +
	//		"   </div>" +
	//		"   <div class='panel-body'>" +
	//		parseMessage(data.message, data.emote_set) +
	//		"   </div>" +
	//		"</div>";

	//	$("#messages").prepend(thing);

	//	$("#messages").children(".comment").slice(300).remove();
	//});
});

function initialize() {
	$.get("/emotes", function(data) {
		window.emoteSet = data;
		$("#loadingEmotesMessage").hide();
		$("#successEmotesMessage").show().delay(7500).fadeOut("slow");
	}, "json");

	$("#channel").select2({
		tags: true
	});

	$("#loginModal").modal();

	$("#getAuthButton").click(function() {
		$("#authTokenModal").modal();
	});

	window.socket = io.connect("127.0.0.1:18044");
}

function getBadges(channel) {
	//$.get("/badges", {channel: channel.replace("#", "")}, function(data) {
	//	window.badgeSet = data;
	//	$("#loadingBadgesMessage").hide();
	//	$("#successBadgesMessage").show().delay(7500).fadeOut("slow");
	//}, "json");
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

function parseAttributes(attributes) {
	if(!attributes || attributes.length === 0 || !window.badgeSet) {
		return "";
	}

	var attributeString = "";
	_.each(attributes, function(attribute, index, list) {
		var matchingBadge = _.find(window.badgeSet, function(badge) {
			return badge.role === attribute;
		});

		attributeString = attributeString + "<img alt='" + matchingBadge.role + "' src='" + matchingBadge.url + "' /> ";
	});

	return attributeString;
}