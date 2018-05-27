var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var SOURCEPATHS = {
  sass: 'src/scss/*.scss'
}

var APPPATHS = {
  root: 'dist/',
  css: 'dist/css',
  js: 'dist/js',
  img: 'dist/img'
}

gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sass)
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(gulp.dest(APPPATHS.css))
});

gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATHS.css + '/*.css', APPPATHS.root + '/*.html', APPPATHS.js + '/*.js'], {
    server: {
      baseDir: APPPATHS.root
    }
  })
});

gulp.task('default', ['serve']);
