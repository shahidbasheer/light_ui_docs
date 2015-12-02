'use strict';
 
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	less = require('gulp-less'),
	path = require('path'),
	preprocess = require('gulp-preprocess'),
	connect = require('gulp-connect-php'),
	compass = require('gulp-compass'),
	uncss = require('gulp-uncss'),
	replace = require('gulp-replace')
	;
	

	var browserSync_server = './';
	var rootAddress = '';
	
	// gulp replace
	var replaceSource = rootAddress  + '/*.php';
	var replaceDest = rootAddress  + 'build';

	gulp.task('templates', function(){
	  gulp.src([ replaceSource ])
	    .pipe(replace(
	    '<h2>ASK THE DOCTOR</h2>\n<p>From big-picture solutions to daily.</p>\n<a href="" class="btn btn-default">Submit Your Question</a>',
	    '<h2>DRGVG AESTHETIC</h2> <p>Trust your face and body to the Specialists.</p> <a href="" class="btn btn-default">Submit Your Question</a>'
	    ))
	    .pipe(gulp.dest( replaceDest ));
	});


	// uncss
	var uncssSrc = ['./uncss/index.html', 'posts/**/*.html', 'http://example.com']
	gulp.task('uncss', function () {
    return gulp.src('./uncss/css/style.css')
        .pipe(uncss({
            html: ['./uncss/index.html']
        }))
        .pipe(gulp.dest('./uncss/out'));
	});
 
	


	var config_rb = rootAddress  + 'config.rb';
	var compassSource = rootAddress  + 'sass/*.scss';
	var compassDest = rootAddress  + 'css';
	var sassFolder = rootAddress  + 'sass';
	var tmpassets = rootAddress  + 'compass_temp_assets';

	gulp.task('compass', function() {
  	gulp.src( compassSource )
    .pipe(compass({
      config_file: config_rb,
      sourcemap: true,
      css: compassDest ,
      sass: sassFolder
 	   }))
  	  .pipe(gulp.dest( tmpassets ));
	});



	var htmlSource = rootAddress  + 'html/*.html';
	var htmlDest =  rootAddress;

	gulp.task('html', function() {
	  gulp.src( htmlSource )
	  	.pipe(preprocess())
	    .pipe(gulp.dest( htmlDest ))
	});

	
	var sassSource = 'sass/style.scss';
	var sassDest = 'css';
	//Type: String Default: nested Values: nested, expanded, compact, compressed
	gulp.task('sass', function () {
	  gulp.src( sassSource )
	    .pipe(sass().on('error', sass.logError))
	    .pipe(sass({outputStyle: 'expanded'}))
	    .pipe(gulp.dest( sassDest ));
	    
	});

	

	var lessSource = rootAddress  + 'less/style.less';
	var lessDest = rootAddress  + 'css';
		
		gulp.task('less', function () {
		  gulp.src( lessSource )
		  	.pipe(less())
		    .pipe(gulp.dest(lessDest));
		});



	// Js concat
	var concatSource = ['./js/vendor/**/*.js']
	gulp.task('concat', function() {
	  return gulp.src( concatSource )
	    .pipe(concat('app.js'))
	    .pipe(gulp.dest('./js'));
	});
	
	
	// Js minify concat
	gulp.task('compress', function() {
	  return gulp.src( concatSource )
	    .pipe(concat('app.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest('./js'));
	});
	
	
	// browser sync
	// server: {
	// 		baseDir: base_Dir,
	// 		index: 'index.html'
	// 	},

	var syncOpts = {
		open: false,
		notify: true
	};

	gulp.task('browserSync', function() {
		 browserSync.init({
        	server: {
		            baseDir: browserSync_server
		        }
		    });
	});
	 
	// autoprefixer
	var sourceCss = './css/style.css';
	gulp.task('prefix', function () {
	    return gulp.src( sourceCss )
	        .pipe(autoprefixer({
	            browsers: ['last 2 versions'],
	            cascade: false
	        }))
	        .pipe(gulp.dest('css'));
		});

	//php server
	var phpWatch = '**/*.php';
	gulp.task('connect-sync', function() {
		  
		  connect.server({}, function (){
			    browserSync({
			      proxy: '127.0.0.1:8000',
			      keepalive: true,
			      open: false,
			    });
		  });
	 
	});


	// default task
	gulp.task('default', ['compass',   'browserSync'], function() {

		// sass changes
		gulp.watch( rootAddress  + 'sass/**/*.scss', ['compass', browserSync.reload]);
		// html changes
		

	});

	// Less watch
	gulp.task('less:watch', ['less'], function() {

		// sass changes
		gulp.watch( rootAddress  + 'less/**/*.less', ['less', browserSync.reload]);
		// html changes
		

	});


	// html watch
	gulp.task('html:watch', ['html', 'less', 'browserSync'], function() {

		// sass changes
		gulp.watch([ rootAddress  +  'less/**/*.less'], ['less', browserSync.reload]);
		// sass changes
		gulp.watch([ rootAddress  +  'html/*.html'], ['html', browserSync.reload]);

	});


	// php watch
	gulp.task('php:watch', ['less', 'connect-sync'], function() {

		// sass changes
		gulp.watch(['./less/**/*.less'], ['less', browserSync.reload]);
		// sass changes
		gulp.watch(['./*.php'], [browserSync.reload]);

	});