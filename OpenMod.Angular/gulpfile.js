var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');

// Load all gulp plugins into the plugins object.
var plugins = require('gulp-load-plugins')();

var src = {
    html: 'src/views/*.html',
    scripts: {
        all: 'src/**/*.js',
        app: 'src/OpenMod.js'
    }
};

var build = 'app/';
var out = {
    html: {
        folder: build + 'views/'
    },
    scripts: {
        file: 'app.min.js',
        folder: build + 'scripts/'
    }
};

gulp.task('html', function() {
    return gulp.src(src.html)
        .pipe(gulp.dest(out.html.folder))
        .pipe(plugins.connect.reload());
});

/* The jshint task runs jshint with ES6 support. */
gulp.task('jshint', function() {
    return gulp.src(src.scripts.all)
        .pipe(plugins.jshint({
            esnext: true // Enable ES6 support
        }))
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

/* Compile all script files into one output minified JS file. */
gulp.task('scripts', ['jshint'], function() {
    return browserify({
            entries: src.scripts.app,
            debug: true // Build source maps
        })
        .transform(babelify.configure({
            // You can configure babel here!
            // https://babeljs.io/docs/usage/options/
        
        }))
        .bundle()
        .pipe(vinylSourceStream(out.scripts.file))
        .pipe(vinylBuffer())
        .pipe(plugins.sourcemaps.init({
            loadMaps: true // Load the sourcemaps browserify already generated
        }))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('./', {
            includeContent: true
        }))
        .pipe(gulp.dest(out.scripts.folder))
        .pipe(plugins.connect.reload());
});

//gulp.task('serve', ['build', 'watch'], function() {
//    plugins.connect.server({
//        root: build,
//        port: 4242,
//        livereload: true,
//        fallback: build + 'index.html'
//    });
//});

gulp.task('_Watch', function() {
    gulp.watch(src.html, ['html']);
    gulp.watch(src.scripts.all, ['scripts']);
});

gulp.task('_Build', ['_Libs', 'scripts', 'html']);
//gulp.task('default', ['serve']);

//----------------------------------
const copyFile = function(source, destination) {
    return gulp.src(source)
        .pipe(gulp.dest(destination));
};

gulp.task('angular', function() {
    return copyFile('node_modules/angular/angular.min.js', 'app/js');
});

gulp.task('bootstrapJS', function() {
    return copyFile('node_modules/bootstrap/dist/js/bootstrap.min.js', 'app/js');
});

gulp.task('bootstrapCSS', function() {
    return copyFile('node_modules/bootstrap/dist/css/bootstrap.min.css', 'app/css');
});

gulp.task('jquery', function() {
    return copyFile('node_modules/jquery/dist/jquery.min.js', 'app/js');
});

gulp.task('_Libs', ['angular', 'bootstrapJS', 'bootstrapCSS', 'jquery']);