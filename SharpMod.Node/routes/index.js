exports.index = function index(req, res) {
	res.render("index", {title: "Express", year: new Date().getFullYear()});
};

exports.login = function index(req, res) {
	res.render("login", {title: "Express", year: new Date().getFullYear()});
};