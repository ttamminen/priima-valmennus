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

// for the clean
var clean = require('gulp-clean');

var onError = function (err) {  
    gutil.beep();
    console.log(err);
};

gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass()).on('error', gutil.log)
        .pipe(prefix("last 2 version", "> 1%", "ie 8"))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

gulp.task('scripts', function () {
    return gulp.src('js/**')
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});

// Concatenate & Minify JS
gulp.task('scriptsmin', function() {
    return gulp.src('js/**')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

/*gulp.task('fileinclude', function () {
    return gulp.src(path.join(paths.templates, '*.tpl.html'))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
});*/

gulp.task('html', function () {
    return gulp.src('html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))        
        .pipe(livereload());
});

gulp.task('htmlmin', function () {
    return gulp.src('html/*.html')
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

gulp.task('static', function () {
    return gulp.src('static/**')
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {    
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/**', ['sass']);
    gulp.watch('html/**', ['html', 'sass', 'lint', 'scripts']);
    gulp.watch('images/**', ['image']);
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('server', function (next) {
    var url = require('url'),
        fileServer = require('ecstatic')({root: './', cache: 'no-cache', showDir: true}),
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

gulp.task('base', ['lint', 'sass', 'image', 'font', 'static']);

// Default Task
gulp.task('default', ['base', 'scripts', 'html', 'watch', 'server' ]);

gulp.task('build', ['base', 'scriptsmin', 'htmlmin', 'image']);