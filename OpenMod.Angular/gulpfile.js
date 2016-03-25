const gulp = require('gulp'),
      sourcemaps = require('gulp-sourcemaps'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify');

const transpileAppFolder = function(folder) {
    const source = `app/${folder}/*.es6`;
    const destination = `app/${folder}`;

    return gulp.src(source)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destination));
};

const transpileFile = function (source, destination) {
    return gulp.src(source)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destination));
};

const copyFile = function(source, destination) {
    return gulp.src(source)
        .pipe(gulp.dest(destination));
};

gulp.task('components', function() {
    return transpileAppFolder('components');
});

gulp.task('models', function() {
    return transpileAppFolder('models');
});

gulp.task('services', function() {
    return transpileAppFolder('services');
});

gulp.task('OpenMod', function() {
    return transpileFile('app/OpenMod.es6', 'app/');
});

gulp.task('register', function() {
    return transpileFile('app/register.es6', 'app/');
});

gulp.task('angular', function() {
    return copyFile('node_modules/angular/angular.min.js', 'js');
});

gulp.task('bootstrapJS', function () {
    return copyFile('node_modules/bootstrap/dist/js/bootstrap.min.js', 'js');
});

gulp.task('bootstrapCSS', function() {
    return copyFile('node_modules/bootstrap/dist/css/bootstrap.min.css', 'css');
});

gulp.task('jquery', function() {
    return copyFile('node_modules/jquery/dist/jquery.min.js', 'js');
});

gulp.task('_ES6', ['components', 'models', 'services', 'OpenMod', 'register']);
gulp.task('_Libs', ['angular', 'bootstrapJS', 'bootstrapCSS', 'jquery']);