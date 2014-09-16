var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglifyjs'),
    traceur = require('gulp-traceur'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace')
;

gulp.task('clean', function () {
  gulp
    .src('./dist', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('compile', function () {
  return gulp
          .src('./src/*.js')
          .pipe(traceur({
            modules: 'commonjs' // work with browsers
          }))
          .pipe(replace(/"use strict";\s/, ''))
          .pipe(gulp.dest('./dist'));
});

gulp.task('compress', ['compile'], function () {
  gulp
    .src('./dist/cookie.js')
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify({ outSourceMap: true }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean', 'compress']);

gulp.task('watch', function () {
  gulp.watch('./src/**/*.js', ['compile']);
});

gulp.task('default', ['build']);
