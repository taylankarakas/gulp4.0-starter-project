const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload();
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const lineec = require('gulp-line-ending-corrector');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');

let public_html = './public_html/assets/';
let src = './src/';
let from_sass = src + 'scss/main.scss';
let to_css = public_html + 'css';
let from_js = src + 'js/main.js';
let to_js = public_html + 'js';
let from_img = src + 'images/**';
let to_img = public_html + 'images';

let cssSrc = [
    src + 'css/bootstrap.css',
]

let jsSRC = [
    src + 'js/jquery-3.4.0.js',
    src + 'js/bootstrap.bundle.js'
];

let styleWatchFiles = src + 'scss/**/*.scss';
let jsWatchFiles = src + 'js/**/*.js';
let htmlWatchFiles = './public_html/**/*.html';

function css() {
    return gulp.src(from_sass)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(lineec())
        .pipe(gulp.dest(to_css))
        .pipe(browserSync.stream());
}

function concatStyle() {
    return gulp.src(cssSrc)
        .pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
        .pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest(to_css))
        .pipe(browserSync.stream());
}

function concatJS() {
    return gulp.src(jsSRC)
        .pipe(concat('plugins.js'))
        .pipe(uglify())
        .pipe(gulp.dest(to_js))
        .pipe(browserSync.stream());
}

function javascript() {
    return gulp.src(from_js)
        .pipe(uglify())
        .pipe(lineec())
        .pipe(gulp.dest(to_js))
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./public_html"
        }
    });
    gulp.watch(styleWatchFiles, gulp.series([css]));
    gulp.watch(jsWatchFiles, gulp.series([javascript]));
    gulp.watch(htmlWatchFiles).on('change',browserSync.reload);
}

exports.css = css;
exports.js = javascript;
exports.watch = watch;
exports.concatJS = concatJS;
exports.concatStyle = concatStyle;

const build = gulp.parallel([css, javascript, concatStyle, concatJS, watch]);
gulp.task('default', build);
