var gulp = require('gulp'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    mmq = require('gulp-merge-media-queries'),
    prefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    prettify = require('gulp-prettify'),
    useref = require('gulp-useref'),
    pug = require('gulp-pug'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    copy = require('gulp-copy');

function time(date){
	function getZero(time){
		if (time < 10) {return '0' + time;}
		return time;
	}
	return ('[' + getZero(date.getHours()) + ':' + getZero(date.getMinutes()) + ':' + getZero(date.getSeconds()) + ']');
}

function html(){
	console.log(time(new Date()), 'html');
	return gulp.src(['develop/pug/**/*.pug', '!develop/pug/**/_*.pug'])
		.pipe(pug({
			pretty: true
		}).on('error', console.log))
		.pipe(gulp.dest('public'))
}

function js(){
	console.log(time(new Date()), 'js');
	gulp.src('develop/js/script.js')
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));

	gulp.src(['develop/js/**/*.js'])
		.pipe(copy('public', {prefix:1}));
}

function css(){
	console.log(time(new Date()), 'css');
	gulp.src('develop/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sass({errLogToConsole: true}))
		.pipe(mmq())
		.pipe(prefixer({browsers: ['> 1%', 'last 5 versions', 'Firefox ESR', 'Opera 12.1']}))
		.pipe(gulp.dest('public/css'));
}

function images(){
	console.log(time(new Date()), 'images');
	gulp.src(['develop/images/**/*', 'develop/pages-content/**/*'])
		.pipe(copy('public', {prefix:1}));
}

function fonts(){
	console.log(time(new Date()), 'fonts');
	gulp.src('develop/fonts/**/*')
		.pipe(copy('public', {prefix:1}));
}

function testing(){
	console.log(time(new Date()), 'testing');
	gulp.src('develop/for_testing/**/*')
		.pipe(copy('public', {prefix:1}));
}



gulp.task('html-task', function(){
	html();
	gulp.watch(['develop/pug/**/*.pug'], html);
});

gulp.task('js-task', function(){
	js();
	gulp.watch(['develop/js/**/*.js'], js);
});

gulp.task('css-task', function(){
	css();
	gulp.watch('develop/scss/**/*.scss', css);
});

gulp.task('images-task', function(){
	images();
	gulp.watch(['develop/images/**/*', 'develop/pages-content/**/*'], images);
});

gulp.task('fonts-task', function(){
	fonts();
	gulp.watch('develop/fonts/**/*', fonts);
});

gulp.task('testing-task', function(){
	testing();
	gulp.watch('develop/for_testing/**/*', testing);
});



gulp.task('default', [
	'html-task',
	'js-task',
	'css-task',
	'images-task',
	'fonts-task',
	'testing-task'
]);