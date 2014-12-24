var gulp = require('gulp'),
    size = require('gulp-size'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect');

gulp.task('sass', function () {
  return gulp.src('scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('css'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(['!js/main.js', 'js/*.js'])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('js-lib', function () {
  return gulp.src(['!js/lib.js', 'lib/js/*.js'])
  .pipe(uglify())
  .pipe(concat('lib.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('css-lib', function () {
  return gulp.src('lib/css/*.css')
    .pipe(cssmin())
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('size', function () {
  return gulp.src(['css/main.css', 'css/lib.css', 'js/main.js', 'js/lib.js'])
    .pipe(size({showFiles: true}));
});

gulp.task('inject-css', function () {
  var sources = gulp.src(['!css/lib.css', 'css/*.css', 'lib/css/*.css'], {read: false})
  return gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('serve', ['js', 'js-lib', 'css-lib', 'sass', 'dev-mode', 'watch'], function() {
  connect.server({
    livereload: true
  });
});

gulp.task('inject-js', function () {
  var sources = gulp.src(['!js/main.js', '!js/lib.js', 'lib/js/*.js', 'js/*.js'], {read: false});

  return gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('prod-mode', function () {
  var sources = gulp.src(['js/lib.js', 'js/main.js', 'css/lib.css', 'css/main.css'], {read: false});

  return gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  return gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('dev-mode', ['inject-css', 'inject-js']);
gulp.task('build', ['js', 'js-lib', 'css-lib', 'sass', 'prod-mode'])
gulp.task('default', ['js', 'js-lib', 'css-lib', 'sass', 'dev-mode']);
