const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const del = require("del");
const pug = require("gulp-pug");
const uglify = require("gulp-uglify-es").default;
const obfuscate = require("gulp-javascript-obfuscator");
const sync = require("browser-sync").create();

const html2pug = () => {
  return gulp.src("source/pug/index.pug")
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest("build"))
}
exports.html2pug = html2pug;

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
}

exports.styles = styles;

const minjs = () => {
  return gulp.src("source/js/main.js")
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(obfuscate())
    .pipe(gulp.dest("build/js"))
}
exports.minjs = minjs;

const clean = () => {
  return del("build")
}

exports.clean = clean;

const copyPages = (done) => {
  gulp.src(["build/**/*.*"],
    {
      base: "build"
    })
    .pipe(gulp.dest("docs"))
  done();
}
exports.copyPages = copyPages;

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

const reload = (done) => {
  sync.reload();
  done();
}

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles, reload));
  gulp.watch("source/pug/**/*.pug", gulp.series(html2pug, reload));
  gulp.watch("source/js/main.js", gulp.series(minjs, reload))
}

exports.default = gulp.series(
  clean,
  gulp.parallel(
    html2pug,
    styles,
    minjs
  ),
  copyPages,
  server,
  watcher
);