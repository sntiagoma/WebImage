var gulp       = require("gulp");
var sass       = require("gulp-sass");
var uglify     = require("gulp-uglify");
var server     = require("gulp-develop-server");
var source     = require("vinyl-source-stream");
var buffer     = require("vinyl-buffer");
var browserify = require("browserify");
var Log        = require("log"), log = new Log("info");

gulp.task('styles',function(){
    gulp.src('sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error',log.error))
        .pipe(gulp.dest('./public/css/'));
    });

gulp.task('styles-pretty',function(){
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./public/css/'));
    });

gulp.task('browserify', function() {  
  return browserify('./front/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('browserify-pretty', function() {  
  return browserify('./front/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function() {
    gulp.watch('./sass/**/*.scss',['styles']);
    gulp.watch('./front/*.js', ['browserify']);
    return;
});

gulp.task('run', function() {
    server.listen({path:'./server.js'});
});


gulp.task('build-pretty', function() {
    gulp.start(['browserify-pretty','styles-pretty']);
    return;
});

gulp.task('build', function() {
    gulp.start(['browserify','styles']);
    return;
});

gulp.task('auto',function() {
    gulp.start(['build-pretty', 'watch', 'run']);
    return;
});

gulp.task('default',function() {
    gulp.start(['build','run']);
    return;
});