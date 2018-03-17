const gulp = require("gulp");
const gulpUtil = require("gulp-util");
const gulpJSHint = require("gulp-jshint");
const gulpSass = require("gulp-sass");
const gulpSourcemaps = require("gulp-sourcemaps");
const gulpAutoprefixer = require("gulp-autoprefixer");
const gulpConcat = require("gulp-concat");
const gulpConnect = require("gulp-connect");
const gulpUglify = require("gulp-uglify");
const gulpBabel = require("gulp-babel");
const gulpPlumber = require("gulp-plumber");
const wait = require("gulp-wait");
const stripDebug = require("gulp-strip-debug");

gulp.task("jshint", () => {
  return gulp
    .src(["js/**/*.js"])
    .pipe(gulpPlumber())
    .pipe(
      gulpJSHint({
        asi: true,
        esversion: 6,
        strict: false,
        browser: true,
        devel: true
      })
    )
    .pipe(gulpJSHint.reporter("jshint-stylish"));
});

gulp.task("build-scss", () => {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(wait(350))
    .pipe(gulpPlumber())
    .pipe(gulpSourcemaps.init())
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(
      gulpAutoprefixer({
        browsers: ["last 2 versions", ">2%"],
        cascade: false
      })
    )
    .pipe(gulpConcat("all.css"))
    .pipe(gulpSourcemaps.write("."))
    .pipe(gulp.dest("./dist/css"))
    .pipe(gulpConnect.reload());
});

gulp.task("build-js", () => {
  return gulp
    .src(["src/js/**/*.js"])
    .pipe(gulpPlumber())
    .pipe(gulpSourcemaps.init())
    .pipe(
      gulpBabel({
        presets: [
          [
            "env",
            {
              targets: {
                browsers: ["last 2 versions", "safari >= 7"]
              }
            }
          ]
        ]
      })
    )
    .pipe(gulpConcat("bundle.min.js"))
    .pipe(stripDebug())
    .pipe(gulpUglify())
    .pipe(gulpSourcemaps.write("."))
    .pipe(gulp.dest("./dist/js"))
    .pipe(gulpConnect.reload());
});

gulp.task("reload-html", () => {
  return gulp
  .src(["src/*.html", "src/templates/*.html"])
  .pipe(gulp.dest("./dist"))
  .pipe(gulpConnect.reload());
});

gulp.task("watch", () => {
  gulpConnect.server({
    livereload: true,
    root: 'dist',
    host: "0.0.0.0"
  });
  gulp.watch("src/**/*.html", ["reload-html"]);
  gulp.watch("src/js/**/*.js", ["jshint", "build-js"]);
  gulp.watch("src/scss/**/*.scss", ["build-scss"]);
});
