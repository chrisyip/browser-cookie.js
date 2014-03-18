var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    coffee = require('gulp-coffee'),
    clean = require('gulp-clean')
;

gulp.task('clean', function () {
  gulp
    .src('./dist', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('build', ['clean'], function() {
  gulp
    .src('./src/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./dist'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify({
      outSourceMap: true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.coffee', function (event) {
    gutil.log(gutil.colors.magenta(event.path.replace(__dirname, '.')), 'changed');

    gulp
      .src(event.path)
      .pipe(coffee().on('error', gutil.log))
      .pipe(gulp.dest('./dist'));
  });
});

gulp.task('default', ['build']);
