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

// for the release
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var htmlreplace = require('gulp-html-replace');
var minifyCSS = require('gulp-minify-css');
var critical = require('critical');

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

gulp.task('vendorscripts', function () {
    return gulp.src('js/vendor/*.js')
        .pipe(gulp.dest('dist/js/vendor/'));
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
                //pngcrush()
            ]
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('copystyles', function () {
    return gulp.src(['dist/css/main.css'])
        .pipe(rename({
            basename: 'site'
        }))
        .pipe(gulp.dest('dist/css'));
});

// Generate & Inline Critical-path CSS
gulp.task('critical', ['build', 'copystyles'], function (cb) {

    // At this point, we have our
    // production styles in main/styles.css

    // As we're going to overwrite this with
    // our critical-path CSS let's create a copy
    // of our site-wide styles so we can async
    // load them in later. We do this with
    // 'copystyles' above

    critical.generate({
        base: 'dist/',
        src: 'index.html',
        dest: 'css/frontpage.css',
        width: 800,
        height: 300,
        minify: true,
        extract: true
    }, function(err, output){
        critical.inline({
            base: 'dist/',
            src: 'index.html',
            dest: 'index.html',
            minify: true
        });        
    });

    critical.generate({
        base: 'dist/',
        src: 'palvelut.html',
        dest: 'css/services.css',
        width: 800,
        height: 300,
        minify: true,
        extract: true
    }, function(err, output){
        critical.inline({
            base: 'dist/',
            src: 'palvelut.html',
            dest: 'palvelut.html',
            minify: true
        });        
    });

    critical.generate({
        base: 'dist/',
        src: 'priimavalmennus.html',
        dest: 'css/priimavalmennus.css',
        width: 800,
        height: 300,
        minify: true,
        extract: true
    }, function(err, output){
        critical.inline({
            base: 'dist/',
            src: 'priimavalmennus.html',
            dest: 'priimavalmennus.html',
            minify: true
        });        
    });

    critical.generate({
        base: 'dist/',
        src: 'otayhteytta.html',
        dest: 'css/contact.css',
        width: 800,
        height: 300,
        minify: true,
        extract: true
    }, function(err, output){
        critical.inline({
            base: 'dist/',
            src: 'otayhteytta.html',
            dest: 'otayhteytta.html',
            minify: true
        });        
    });    
});

gulp.task('static', function () {
    return gulp.src('static/**', { dot: true })
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', ['server'], function() {
    var server = livereload();
    gulp.watch('dist/**').on('change', function(file) {
        server.changed(file.path);
    });
    gulp.watch('js/**', ['scripts']);
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('html/**/*.html', ['html', 'sass', 'scripts']);
    gulp.watch('images/**', ['image']);
});

gulp.task('server', function (next) {
    var url = require('url'),
        fileServer = require('ecstatic')({root: './', cache: 'no-cache', showDir: true, gzip: true }),
        port = 8000;
    require('http').createServer()
        .on('request', function (req, res) {
            // For non-existent files output the contents of /index.html page in order to make HTML5 routing work
            var urlPath = url.parse(req.url).pathname;
            if (urlPath === '/') {
                req.url = '/dist/index.html';
            } else if (urlPath === '/palvelut') {
                req.url = '/dist/palvelut.html';
            } else if (urlPath === '/otayhteytta') {
                req.url = '/dist/otayhteytta.html';
            } else if (urlPath === '/priimavalmennus') {
                req.url = '/dist/priimavalmennus.html';
            }
            else if (
                ['css', 'html', 'ico', 'less', 'js', 'png', 'txt', 'xml'].indexOf(urlPath.split('.').pop()) == -1 &&
                ['bower_components', 'fonts', 'images', 'src', 'vendor', 'views'].indexOf(urlPath.split('/')[1]) == -1) {
                req.url = '/dist/index.html';
            } else if (['src', 'bower_components'].indexOf(urlPath.split('/')[1]) == -1) {
                req.url = '/dist' + req.url;
            }
            fileServer(req, res);
        })
        .listen(port, function () {
            gutil.log('Server is listening on ' + gutil.colors.magenta('http://localhost:' + port + '/'));
            next();
        });
});

// Default Task
gulp.task('default', ['sass', 'image', 'font', 'static', 'scripts', 'html', 'server', 'watch' ]);

gulp.task('build', ['sassmin', 'image', 'font', 'static', 'scriptsmin', 'vendorscripts', 'htmlmin']);

gulp.task('run', ['server']);