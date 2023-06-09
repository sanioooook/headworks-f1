// VARIABLES AND PATHS
const filesToWatch = 'html,htm,txt,json,md,woff2'; // List of files extensions for watching & hard reload (comma separated)
const imagesToWatch = 'jpg,jpeg,png,webp,svg'; // List of images extensions for watching & compression (comma separated)
const baseDir = 'app'; // Base directory path without «/» at the end
const isOnline = true; // If «false» - Browsersync will work offline without internet connection

const {src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = import('gulp-imagemin');
const newer = require('gulp-newer');
const del = import('del');

function browsersync() {
  browserSync.init({
    server: {baseDir: baseDir + '/'},
    notify: false,
    online: isOnline
  })
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(concat(paths.jsOutputName))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

function styles() {
  return src(paths.styles.src)
    .pipe(sass())
    .pipe(concat(paths.cssOutputName))
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions'], grid: true}))
    .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

async function images() {
  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe((await imagemin).default())
    .pipe(dest(paths.images.dest))
}

async function cleanimg() {
  return await (await del).deleteAsync('' + paths.images.dest + '/**/*', {force: true})
}

const paths = {
  scripts: {
    src: [
      // 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
      baseDir + '/js/app.js' // app.js. Always at the end
    ],
    dest: baseDir + '/js',
  },

  styles: {
    src: baseDir + '/' + "scss" + '/main.scss',
    dest: baseDir + '/css',
  },

  images: {
    src: baseDir + '/images/src/**/*',
    dest: baseDir + '/images/dest',
  },

  cssOutputName: 'styles.min.css',
  jsOutputName: 'scripts.min.js',
}

function startwatch() {
  watch(baseDir + '/' + "scss" + '/**/*', {usePolling: true}, styles);
  watch(baseDir + '/images/src/**/*.{' + imagesToWatch + '}', {usePolling: true}, images);
  watch(baseDir + '/**/*.{' + filesToWatch + '}', {usePolling: true}).on('change', browserSync.reload);
  watch([baseDir + '/js/**/*.js', '!' + paths.scripts.dest + '/*.min.js'], {usePolling: true}, scripts);
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.cleanimg = cleanimg;
exports.default = parallel(images, styles, scripts, browsersync, startwatch);
