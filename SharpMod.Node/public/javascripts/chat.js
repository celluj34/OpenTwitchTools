$(function() {
	var serverBaseUrl = document.domain;

	var socket = io.connect(serverBaseUrl + ":18044");

	socket.on("incomingMessage", function(data) {
		var message = data.message;
		var name = data.name;
		var msg = "<b>" + name + "</b><br />" + message;
		console.log(msg);
		$("#messages").prepend(msg + "<hr />");
	});

	$(window).on("beforeunload", function() {
		socket.close();
	});
});