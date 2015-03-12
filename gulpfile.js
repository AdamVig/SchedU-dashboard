var gulp = require('gulp'),
    print = require('gulp-print'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    watch = require('gulp-watch'),
    order = require('gulp-order'),
    mainBowerFiles = require('main-bower-files'),
    series = require('stream-series'),
    gulpFilter = require('gulp-filter');

gulp.task('sass', function () {
  return gulp.src('scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('css'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(['!js/main.js', 'js/**/*.js'])
    .pipe(order(['dashboard.js', '*.js', '**/*.js']))
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('bower', function () {

  var jsFilter = gulpFilter(['!**/*.min.js', '**/*.js']);
  var cssFilter = gulpFilter(['*.css']);

  gulp.src(mainBowerFiles())
    .pipe(cssFilter)
    .pipe(gulp.dest('./lib/css'));

  return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(gulp.dest('./lib/js'));

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

gulp.task('inject-css', function () {
  var sources = gulp.src(['!css/lib.css', 'css/*.css', 'lib/css/*.css'], {read: false});
  return gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('inject-js', function () {
  var libSources = gulp.src('lib/js/*.js', {read: false});
  var mainSources = gulp.src(['!js/main.js', '!js/lib.js', 'js/**/*.js'], {read: false})
    .pipe(order(['dashboard.js', '*.js', '**/*.js']));

  return gulp.src('index.html')
    .pipe(inject(series(libSources, mainSources)))
    .pipe(gulp.dest('./'));
});

gulp.task('inject-minified', function () {
  var sources = gulp.src(['js/lib.js', 'js/main.js', 'css/lib.css', 'css/main.css'], {read: false});

  return gulp.src('index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('serve', ['sass', 'dev-mode'], function () {

  connect.server({
    livereload: true,
    host: 'local.dev',
    port: 8100
  });

  gulp.src('index.html')
    .pipe(open('', {
      url: 'http://local.dev:8100/',
      app: 'Google Chrome'
    }));

  gulp.watch('scss/*.scss', ['sass']);

  var watchPaths = ['index.html', 'templates/**/*.html', 'js/**/*.js'];

  return gulp.src(watchPaths)
    .pipe(watch(watchPaths))
    .pipe(connect.reload());
});

gulp.task('dev-mode', ['inject-css', 'inject-js']);
gulp.task('build', ['js', 'js-lib', 'css-lib', 'sass', 'inject-minified']);
gulp.task('default', ['js', 'js-lib', 'css-lib', 'sass', 'dev-mode']);
