const gulp = require('gulp'),
      sourcemaps = require('gulp-sourcemaps'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat');

const transpile = function(folder) {
    return gulp.src(`app/${folder}/*.es6`)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat(`_${folder}.js`))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`app/${folder}`));
};

gulp.task('controllers', function() {
    return transpile('controllers');
});

gulp.task('directives', function() {
    return transpile('directives');
});

gulp.task('models', function() {
    return transpile('models');
});

gulp.task('services', function() {
    return transpile('services');
});

gulp.task('ES6', ['controllers', 'directives', 'models', 'services']);