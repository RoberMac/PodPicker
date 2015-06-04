var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS  = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    minifyHTML = require('gulp-minify-html');

var paths = {
    js  : ['js/angular-storage.min.js', 'js/pp-app.js'],
    css : ['css/pp-app.css'],
    html: ['template/first-contact.html', 'template/post-picker.html', 'template/guide.html']
};

// Minify JavaScript
gulp.task('js', function() {

    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat('pp-app.min.js'))
            .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('js'));
});

// Minify CSS
gulp.task('css', function () {

    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
            .pipe(minifyCSS({keepSpecialComments: 1}))
            .pipe(concat('pp-app.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('css'))
})

// Minify HTML template files
gulp.task('html', function (){

    return gulp.src(paths.html)
        .pipe(minifyHTML({loose: true}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('template'))
})

// Rerun the task when a file changes 
gulp.task('watch', function() {

    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.html, ['html']);
});

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['watch', 'js', 'css', 'html']);