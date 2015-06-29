/// <binding BeforeBuild='copy' Clean='clean' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    fs = require("fs");

eval("var project = " + fs.readFileSync("./project.json"));

var paths = {
    bower: "./bower_components/",
    lib: "./assets/lib/"
};

gulp.task("clean", function(cb) {
    rimraf(paths.lib, cb);
});

gulp.task("copy", ["clean"], function() {
    var bower = {
        "at.js": "at.js/dist/**/*.{css,js,map}",
        "bootstrap": "bootstrap/dist/**/*.{css,js,map,ttf,svg,woff,woff2,eot}",
        "caret.js": "caret.js/dist/**/*.{css,js,map}",
        "jquery": "jquery/dist/jquery*.{js,map}",
        "knockout": "knockout/dist/knockout*.{js,map}",
        "select2": "select2/dist/**/*{css,js,map}",
        "underscore": "underscore/underscore*.{js,map}"
    };

    for(var destinationDir in bower) {
        gulp.src(paths.bower + bower[destinationDir])
            .pipe(gulp.dest(paths.lib + destinationDir));
    }
});

gulp.task("default", ["clean", "copy"]);