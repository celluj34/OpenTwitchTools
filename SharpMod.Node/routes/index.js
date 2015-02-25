function index(req, res) {
    res.render("index", { title: "Express", year: new Date().getFullYear() });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map
