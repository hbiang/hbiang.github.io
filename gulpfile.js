var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssminify = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var ts = require('gulp-typescript');

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var config = {
    src_dir: './src/',
    res_dir: './res/'
}

var paths = {
    src_path: {
        js: config.src_dir + 'js/',
        scss: config.src_dir + 'scss/',
        bootstrap: config.src_dir + 'scss/**/meteria.scss'
    },
    output_path: {
        js: config.res_dir + 'js/',
        css: config.res_dir + 'css'
    }
};

gulp.task('css_bootstrap_task', function() {
    return gulp
        .src([
            paths.src_path.bootstrap
        ])
        .pipe(sass(sassOptions))
        .on('error', sass.logError)
        .pipe(gulp.dest(paths.output_path.css))
        .pipe(cssminify())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(paths.output_path.css));
});

gulp.task('css_materia_task', function() {
    return gulp
        .src([
            './src/scss/bootstrap/v405/meteria.scss'
        ])
        .pipe(sass(sassOptions))
        .on('error', sass.logError)
        .pipe(gulp.dest('./res/lib/bootstrap/css'))
        .pipe(cssminify())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./res/lib/bootstrap/css'));
});

gulp.task('css_task', function() {
    return gulp
        .src([
            paths.src_path.scss + '**/*.scss',
            '!' + paths.src_path.scss + 'bootstrap/**',
            '!' + paths.src_path.scss + '/**/inc_*.scss'
        ])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions))
        .on('error', sass.logError)
        .pipe(gulp.dest(paths.output_path.css))
        .pipe(cssminify())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(paths.output_path.css));
});

gulp.task('js_task', function() {
    return gulp
        .src([paths.src_path.js + 'common.js', paths.src_path.js + 'index.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest(paths.output_path.js))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(paths.output_path.js));
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: true,
            open: true,
            port: 80
        }));
});


gulp.task('default', ['webserver'], function() {
    gulp.watch('./src/scss/**/*.scss', ['css_task']);
    gulp.watch('./src/js/**/*.js', ['js_task']);
});