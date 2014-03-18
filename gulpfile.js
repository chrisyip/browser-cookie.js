var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    traceur = require('gulp-traceur'),
    clean = require('gulp-clean')
;

gulp.task('clean', function () {
  gulp
    .src('./dist', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('build', ['clean'], function() {
  gulp
    .src('./src/*.js')
    .pipe(traceur({
      modules: false // work with browsers
    }))
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
  gulp.watch('./src/**/*.js', function (event) {
    gutil.log(gutil.colors.magenta(event.path.replace(__dirname, '.')), 'changed');

    gulp
      .src(event.path)
      .pipe(traceur({
        modules: false // work with browsers
      }))
      .pipe(gulp.dest('./dist'));
  });
});

gulp.task('default', ['build']);
