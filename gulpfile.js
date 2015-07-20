var gulp 				= require('gulp');
var path 				= require('path');
var karma 			= require('karma').server;
var concat 			= require('gulp-concat');
var uglify 			= require('gulp-uglify');
var wrapper			= require('gulp-wrapper');
var sourcemaps 	= require('gulp-sourcemaps');
var ngAnnotate 	= require('gulp-ng-annotate');

var paths = {
	scripts: ['src/**/*.js']
};

gulp.task('test', function (done) {
	karma.start({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun: true
	}, done);
});

gulp.task('build', function () {
	gulp.src(paths.scripts)
		.pipe(ngAnnotate())
		.pipe(concat('ng-currency-mask.js'))
		.pipe(gulp.dest('dist'));

	return gulp.src(paths.scripts)
		.pipe(ngAnnotate())
		.pipe(concat('ng-currency-mask.min.js'))
		.pipe(wrapper({
			header: '(function (window, undefined, angular) {',
			footer: '}(window, undefined, angular));'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['build']);
});

gulp.task('default', ['watch', 'build']);