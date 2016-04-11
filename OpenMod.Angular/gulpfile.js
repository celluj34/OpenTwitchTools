var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var plugins = require('gulp-load-plugins')();

var build = 'app/';

var src = {
    html: 'src/views/*.html',
    css: {
        themes: 'node_modules/bootswatch/**/bootstrap.min.css',
        fonts: 'node_modules/bootswatch/fonts/*'
    },
    scripts: {
        all: 'src/**/*.js',
        app: 'src/OpenMod.js'
    }
};

var out = {
    html: {
        folder: build + 'views/'
    },
    themes: {
        folder: build + 'themes/'
    },
    fonts: {
        folder: build + 'fonts/'
    },
    scripts: {
        folder: build + 'scripts/',
        file: 'app.min.js'
    }
};

gulp.task('html', function() {
    return gulp.src(src.html)
        .pipe(gulp.dest(out.html.folder));
});

gulp.task('fonts', function () {
    return gulp.src(src.css.fonts)
        .pipe(gulp.dest(out.fonts.folder));
});

gulp.task('themes', function() {
    return gulp.src(src.css.themes)
        .pipe(rename(function(path) {
            path.basename = 'bootstrap-' + path.dirname;
            path.extname = '.min.css';
            path.dirname = '';
        }))
        .pipe(gulp.dest(out.themes.folder));
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
            debug: true, // Build source maps
        })
        .transform(babelify.configure({
            // You can configure babel here!
            // https://babeljs.io/docs/usage/options/
            presets: ['es2016']
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
        .pipe(gulp.dest(out.scripts.folder));
});

gulp.task('_Build', ['scripts', 'html', 'themes', 'fonts']);

gulp.task('default', ['_Build']);
