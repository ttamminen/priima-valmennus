var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var fileinclude = require('gulp-file-include');
var prefix = require('gulp-autoprefixer');
var debug = require('gulp-debug');

// for the release
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var htmlreplace = require('gulp-html-replace');
var smoosher = require('gulp-smoosher');
var minifyCSS = require('gulp-minify-css');

var del = require('del');
var vinylPaths = require('vinyl-paths');

var onError = function (err) {
    gutil.beep();
    console.log(err);
};

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass()).on('error', gutil.log)
        .pipe(prefix("last 2 version", "> 1%", "ie 8"))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

gulp.task('sassmin', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass()).on('error', gutil.log)
        .pipe(prefix("last 2 version", "> 1%", "ie 8"))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function () {
    return gulp.src('js/**')
    	.pipe(debug())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))   
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});

gulp.task('scriptsmin', function () {
    return gulp.src(['js/bundled_vendor/*.js', 'js/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function () {
    return gulp.src('html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('htmlmin', ['sassmin'], function () {
    return gulp.src('html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))    
        .pipe(htmlreplace({
            'css': 'css/styles.min.css',
            'js': 'js/all.min.js'
        }))
        .pipe(smoosher({
            base: 'dist'
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('font', function () {
    return gulp.src('fonts/**')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('image', function () {
    return gulp.src('images/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
            { moveGroupAttrsToElems: false },
            { convertPathData: false },
            { removeViewBox: false}
            ],
            use: [
                pngcrush()
            ]
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('static', function () {
    return gulp.src('static/**', { dot: true })
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', ['server'], function() {
    var server = livereload();
    gulp.watch('dist/**').on('change', function(file) {
        //server.changed(file.path);
    });
    gulp.watch('js/**', ['scripts']);
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('html/**/*.html', ['html', 'sass', 'scripts']);
    gulp.watch('images/**', ['image']);
});

gulp.task('server', function (next) {
    var url = require('url'),
        fileServer = require('ecstatic')({root: './dist', cache: 'no-cache', showDir: true, gzip: true, defaultExt: true }),
        port = 8000;
    require('http').createServer()
        .listen(port, function () {
            gutil.log('Server is listening on ' + gutil.colors.magenta('http://localhost:' + port + '/'));
            next();
        });
});

gulp.task('cleandist', ['htmlmin'], function () {
    del(['dist/*.tpl.html', 'dist/js/bundled_vendor']);
});

// Default Task
gulp.task('default', ['sass', 'image', 'font', 'static', 'scripts', 'html', 'server', 'watch' ]);

gulp.task('build', ['sassmin', 'image', 'font', 'static', 'scriptsmin', 'htmlmin', 'cleandist']);

gulp.task('run', ['server']);