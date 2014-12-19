var gulp = require('gulp'),
    size = require('gulp-size'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    inject = require('gulp-inject');

gulp.task('sass', function () {
  gulp.src('scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('css'));
});

gulp.task('js', function () {
  gulp.src(['!js/main.js', 'js/*.js'])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('js-lib', function () {
  gulp.src(['!js/lib.js', 'lib/js/*.js'])
  .pipe(uglify())
  .pipe(concat('lib.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('css-lib', function () {
  gulp.src('lib/css/*.css')
    .pipe(cssmin())
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('size', function () {
  gulp.src(['css/main.css', 'css/lib.css', 'js/main.js', 'js/lib.js'])
    .pipe(size({showFiles: true}));
});

gulp.task('watch', function () {
  gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('inject-css', function () {
  var sources = gulp.src(['!css/lib.css', 'css/*.css', 'lib/css/*.css'], {read: false})
  gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('inject-js', function () {
  var sources = gulp.src(['!js/main.js', '!js/lib.js', 'lib/js/*.js', 'js/*.js'], {read: false});

  gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('prod-mode', function () {
  var sources = gulp.src(['js/lib.js', 'js/main.js', 'css/lib.css', 'css/main.css'], {read: false});

  gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('dev-mode', ['inject-css', 'inject-js']);
gulp.task('build', ['js', 'js-lib', 'css-lib', 'sass', 'prod-mode'])
gulp.task('default', ['js', 'js-lib', 'css-lib', 'sass', 'dev-mode']);
