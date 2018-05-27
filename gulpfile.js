var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');

var SOURCEPATHS = {
  sass: 'src/scss/*.scss',
  html: 'src/html/*.html'
}

var APPPATHS = {
  root: 'dist/',
  css: 'dist/css',
  js: 'dist/js',
  img: 'dist/img'
}

gulp.task('clean-html', function(){
  return gulp.src(APPPATHS.root + '/*.html', {read: false, force: true})
             .pipe(clean())
});

gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sass)
  .pipe(autoprefixer())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(gulp.dest(APPPATHS.css));
});

gulp.task('copy', ['clean-html'], function(){
  gulp.src(SOURCEPATHS.html)
      .pipe(gulp.dest(APPPATHS.root));
});

gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATHS.css + '/*.css', APPPATHS.root + '/*.html', APPPATHS.js + '/*.js'], {
    server: {
      baseDir: APPPATHS.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html'], function(){
  gulp.watch([SOURCEPATHS.sass], ['sass']);
  gulp.watch([SOURCEPATHS.html], ['copy']);
});

gulp.task('default', ['watch']);
