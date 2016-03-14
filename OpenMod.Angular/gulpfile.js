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

const transpileFile = function(file) {
    const destination = `app/${file}`;

    return gulp.src(file)
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
        .pipe(uglify())
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
    return transpileFile('OpenMod.es6');
});

gulp.task('angular', function() {
    return copyFile('node_modules/angular/angular.js', 'js/angular');
});

gulp.task('_ES6', ['components', 'models', 'services']);
gulp.task('_Angular', ['angular']);