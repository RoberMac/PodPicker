var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS  = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    babel      = require("gulp-babel");

var paths = {
    babel: ['src/PodPicker.babel.js'],
    js   : ['dist/PodPicker.js'],
    css  : ['dist/PodPicker.css']
};

// ES6
gulp.task("es6", function () {
  return gulp.src(paths.babel)
    .pipe(babel())
    .pipe(concat('PodPicker.js'))
    .pipe(gulp.dest("dist"));
});

// Minify JavaScript
gulp.task('js', function() {

    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
            .pipe(uglify({preserveComments: 'some'}))
            .pipe(concat('PodPicker.min.js'))
            .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

// Minify CSS
gulp.task('css', function () {

    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
            .pipe(minifyCSS({keepSpecialComments: 1}))
            .pipe(concat('PodPicker.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'))
})


// Rerun the task when a file changes 
gulp.task('watch', function() {
    gulp.watch(paths.babel, ['es6'])
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.css, ['css']);
});

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['watch', 'es6' , 'js', 'css']);