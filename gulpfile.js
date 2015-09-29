var gulp = require('gulp');
var nwBuilder = require('gulp-nw-builder');

// define tasks here
gulp.task('build', function () {
    return gulp.src(['./app/**/*'])
        .pipe(nwBuilder({
            version: 'v0.12.2',
            platforms: ['win64']
        }));
});