const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');

const serverAppFiles = ['src/**/*.jsx','!src/www/**','src/server.js'];
const webAppFiles = ['src/www/**/*.js','node_modules/**/**/*.js'];
const webAppHtmlFiles = ['src/www/**/*.html'];
const webAppCssFiles = ['src/www/css/**/*.css'];
const webAppLessFiles = ['./src/www/less/**/*.less'];
const defaultTasks = [
	'process-server-app',
	'process-web-app-html',
	'process-web-app-css',
	'process-web-app-js',
	'process-web-app-less'
];

const entryPoints = ['./src/www/js/spells.js'];

gulp.task('process-server-app', () =>
	gulp.src(serverAppFiles)
		.pipe(babel({ presets: ['es2015'] }))
		.on('error', console.error)
		.pipe(gulp.dest('dist')));

gulp.task('process-web-app-html', () =>
	gulp.src(webAppHtmlFiles)
		.pipe(gulp.dest('dist/www')));

gulp.task('process-web-app-css', () =>
	gulp.src(webAppCssFiles)
		.pipe(gulp.dest('dist/www/css')));

gulp.task('process-web-app-js', () =>
	Promise.all(entryPoints.map(entryPoint =>
		new Promise((resolve, reject) =>
			gulp.src(entryPoint)
				.pipe(webpackStream({
					output: {
						filename: path.basename(entryPoint)
					},
					module: {
						loaders: [{
							test: /\.json$/,
							loader: 'json'
						},{
							test: /\.js$/,
							loader: 'babel-loader',
							exclude: ['/node_modules/','!/node_modules/simple-react-forms/'],
							query: {
								passPerPreset: true,
								presets: ['react', 'es2015']
							}
						}]
					},
					plugins: [
						new webpack.ProvidePlugin({
							'Promise': 'exports?global.Promise!es6-promise',
							'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
							'window.fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
						})
					]
				}))
				.on('error', reject)
				.pipe(gulp.dest('dist/www/js'))
				.on('end', resolve)))).catch(console.error));

gulp.task('process-web-app-less',  () =>
  gulp.src(webAppLessFiles)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/www/css')));

gulp.task('server', () =>
	fs.readFile('./config.json', (err, data) =>
		err ? console.dir(err)
			: require('./dist/server.js').default(JSON.parse(data))));
gulp.task('default', defaultTasks);
gulp.task('localdev', defaultTasks, function () {

	gulp.watch(webAppFiles, ['process-web-app-js']);
	gulp.watch(webAppCssFiles, ['process-web-app-css']);
	gulp.watch(webAppLessFiles, ['process-web-app-less']);
	gulp.watch(webAppHtmlFiles, ['process-web-app-html']);
	gulp.watch(serverAppFiles, ['process-server-app']);

});
