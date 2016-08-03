'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const webpack = require('webpack-stream');

gulp.task('build', function () {
	return gulp.src('src/index.js')
		.pipe(webpack({
			entry: './src/index.js',
			output: {
				library: 'otter',
				libraryTarget: 'umd',
				filename: 'otter.js'
			},
			externals: {
				global: 'typeof self !== "undefined" ? self : ' +
    				'typeof window !== "undefined" ? window : ' +
    				'typeof global !== "undefined" ? global : {}'
			},
			module: {
				loaders: [
					{
						test: /\.js$/,
						exclude: /(node_modules|bower_components)/,
						loader: 'babel',
						query: {
							presets: ['es2015']
						}
					}
				]
			}
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('test', function () {
	return gulp.src('test/**/*.js', { read: false })
		.pipe(mocha({

		}));
});
