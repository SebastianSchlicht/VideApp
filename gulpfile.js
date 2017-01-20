const gulp = require('gulp');
const browserify = require('browserify'); //allows packaging
const babelify = require('babelify'); //translates JSX to browser-compatible Javascript
const source = require('vinyl-source-stream'); //Use conventional text streams at the start of your gulp or vinyl pipelines
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');

gulp.task('html', function() {
    return gulp.src('./source/index.html')
        // Perform minification tasks, etc here
        .pipe(gulp.dest('./build/'));
});

gulp.task('fonts', function() {
    return gulp.src('./source/fonts/**/*.{ttf,woff,eof,svg}')
        // Perform minification tasks, etc here
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('css', function() {
    return gulp.src('./source/sass/**/*.scss')
        .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./build/resources/css/'));
});

gulp.task('lint', function() {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({ fix: true }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(gulp.dest('.'))
        .pipe(eslint.failAfterError());  
    /* 
     * DOKU: bislang auf commandline: ./node_modules/.bin/eslint source --fix
     * 
     */
});

gulp.task('default', ['html', 'css', 'fonts'], function() {
    return browserify('./source/app.js')
        .transform(babelify, {presets: ['es2015', 'react'], plugins: ['transform-object-rest-spread']})
        .bundle()
        .pipe(source('resources/js/main.js'))
        .pipe(gulp.dest('./build/'));
});