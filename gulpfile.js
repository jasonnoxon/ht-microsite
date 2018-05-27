var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');

var SOURCEPATHS = {
  sass: 'src/scss/*.scss',
  html: 'src/html/*.html',
  js: 'src/js/*.js'
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

gulp.task('clean-scripts', function(){
  return gulp.src(APPPATHS.js + '/*.js', {read: false, force: true})
             .pipe(clean())
});

gulp.task('sass', function(){

  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sass)
  .pipe(autoprefixer())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

  return merge(bootstrapCSS, sassFiles)
    .pipe(concat('app.css'))
  .pipe(gulp.dest(APPPATHS.css));
});

gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SOURCEPATHS.js)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(gulp.dest(APPPATHS.js));
})

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

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'scripts', 'clean-scripts'], function(){
  gulp.watch([SOURCEPATHS.sass], ['sass']);
  gulp.watch([SOURCEPATHS.html], ['copy']);
  gulp.watch([SOURCEPATHS.js], ['scripts']);
});

gulp.task('default', ['watch']);
