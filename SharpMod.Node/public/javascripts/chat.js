$(function() {
	getEmotes();
	getBadges();

	var socket = io.connect("127.0.0.1:18044");

	socket.on("incomingMessage", function(data) {
		//{name: user.username, attributes: user.special, emote_set : user.emote, color: user.color, message: message, channel: incChannel}
		//{name               , attributes              , emote_set             , color            , message         , channel            }

		var thing = "<div class='panel panel-default'>" +
			"   <div class='panel-heading'>" +
			"       <h3 class='panel-title' style='color: " + data.color + "; font-weight:bold'>" + data.name + "</h3>" +
			"   </div>" +
			"   <div class='panel-body'>" +
			parseMessage(data.message, data.emote_set) +
			"   </div>" +
			"</div>";

		$("#messages").prepend(thing);
	});
});

function getEmotes() {
	$.get("/emotes", function(data) {
		window.emoteSet = data;
		$("#loadingEmotesMessage").hide();
		$("#successEmotesMessage").show().delay(7500).fadeOut("slow");
	}, "json");
}

function getBadges() {
	$.get("/badges", {channel: $("#channel").text().replace("#", "")}, function(data) {
		window.badgeSet = data;
		$("#loadingBadgesMessage").hide();
		$("#successBadgesMessage").show().delay(7500).fadeOut("slow");
	}, "json");
}

function parseMessage(message, availableEmotes) {
	if(!window.emoteSet) {
		return message;
	}

	var words = message.split(" ");
	var newWords = [];
	var tempWord;
	var emoteList;

	if(availableEmotes.length === 0) {
		emoteList = [];
	}
	else {
		emoteList = JSON.parse(availableEmotes);
	}

	_.each(words, function(word) {
		tempWord = _.find(window.emoteSet, function(emote) {
			return word.match(emote.regex) && (!emote.emoticon_set || _.contains(emoteList, emote.emoticon_set));
		});

		if(tempWord) {
			newWords.push(tempWord.url);
		}
		else {
			newWords.push(word);
		}
	});

	return newWords.join(" ");
}