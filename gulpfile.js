var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');

var SOURCEPATHS = {
  sass: 'src/scss/*.scss',
  html: 'src/html/*.html',
  htmlPartial: 'src/html/partials/*.html',
  js: 'src/js/*.js',
  img: 'src/img/**',
  docs: 'src/docs/**',
}

var DEVPATHS = {
  root: 'dev/',
  css: 'dev/css',
  js: 'dev/js',
  img: 'dev/img',
  fonts: 'dev/fonts',
  docs: 'dev/docs'
}

var BUILDPATHS = {
  root: 'build/',
  css: 'build/css',
  js: 'build/js',
  img: 'build/img',
  fonts: 'build/fonts',
  docs: 'build/docs'
}

gulp.task('clean-html', function(){
  return gulp.src(DEVPATHS.root + '/*.html', {read: false, force: true})
             .pipe(clean())
});

gulp.task('clean-scripts', function(){
  return gulp.src(DEVPATHS.js + '/*.js', {read: false, force: true})
             .pipe(clean())
});

gulp.task('html', function() {
    return gulp.src(SOURCEPATHS.html)
               .pipe(injectPartials())
               .pipe(gulp.dest(DEVPATHS.root));
});

gulp.task('sass', function(){

  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
  var fontAwesomeCSS = gulp.src('./node_modules/font-awesome/css/font-awesome.css')
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sass)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

  return merge(bootstrapCSS, fontAwesomeCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(DEVPATHS.css));
});

gulp.task('images', function(){
    return gulp.src(SOURCEPATHS.img)
               .pipe(newer(DEVPATHS.img))
               .pipe(imagemin())
               .pipe(gulp.dest(DEVPATHS.img));
});

gulp.task('copy-fonts', function(){
  gulp.src('./node_modules/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}')
      .pipe(gulp.dest(DEVPATHS.fonts))

})

gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SOURCEPATHS.js)
      .pipe(concat('app.js'))
      .pipe(browserify())
      .pipe(gulp.dest(DEVPATHS.js));
})

gulp.task('docs', function(){
  gulp.src(SOURCEPATHS.docs)
      .pipe(gulp.dest(DEVPATHS.docs))
});

//** Production Tasks  **//
gulp.task('compress-html', function() {
    return gulp.src(SOURCEPATHS.html)
               .pipe(injectPartials())
               .pipe(replace('app.css', 'app.min.css'))
               .pipe(replace('app.js', 'app.min.js'))
               .pipe(htmlmin({collapseWhitespace: true}))
               .pipe(gulp.dest(BUILDPATHS.root));
});

gulp.task('compress-js', function(){
  gulp.src(SOURCEPATHS.js)
      .pipe(concat('app.js'))
      .pipe(browserify())
      .pipe(minify( {ext:{
            min:'.min.js'}
        }))
      .pipe(gulp.dest(BUILDPATHS.js));
})

gulp.task('compress-css', function(){

  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
  var fontAwesomeCSS = gulp.src('./node_modules/font-awesome/css/font-awesome.css')
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sass)
  .pipe(autoprefixer())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

  return merge(bootstrapCSS, fontAwesomeCSS, sassFiles)
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(BUILDPATHS.css));
});

gulp.task('images-build', function(){
    return gulp.src(SOURCEPATHS.img)
               .pipe(newer(BUILDPATHS.img))
               .pipe(imagemin())
               .pipe(gulp.dest(BUILDPATHS.img));
});

gulp.task('copy-fonts-build', function(){
  gulp.src('./node_modules/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}')
      .pipe(gulp.dest(BUILDPATHS.fonts))
})

gulp.task('docs-build', function(){
  gulp.src(SOURCEPATHS.docs)
      .pipe(gulp.dest(BUILDPATHS.docs))
})

//** END Production Tasks  **//

// gulp.task('copy', ['clean-html'], function(){
//   gulp.src(SOURCEPATHS.html)
//       .pipe(gulp.dest(DEVPATHS.root));
// });

gulp.task('serve', ['sass'], function(){
  browserSync.init([DEVPATHS.css + '/*.css', DEVPATHS.root + '/*.html', DEVPATHS.js + '/*.js'], {
    server: {
      baseDir: DEVPATHS.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'html', 'clean-html', 'scripts', 'clean-scripts', 'copy-fonts', 'images'], function(){
  gulp.watch([SOURCEPATHS.sass], ['sass']);
  //gulp.watch([SOURCEPATHS.html], ['copy']);
  gulp.watch([SOURCEPATHS.js], ['scripts']);
  gulp.watch([SOURCEPATHS.img], ['images']);
  gulp.watch([SOURCEPATHS.html, SOURCEPATHS.htmlPartial], ['html']);
});

gulp.task('default', ['watch']);

gulp.task('build', ['compress-html', 'compress-js', 'compress-css', 'images-build', 'copy-fonts-build', 'docs-build'])
