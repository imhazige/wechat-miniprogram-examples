const {
	resolve
} = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		'index': './src/index.js'
	},
	output: {
		filename: '[name].js',
		// the output bundle
		chunkFilename: '[name].bundle.js',
		//need not if not use development server
		path: resolve(__dirname, 'j'),

		//need not here, will not use development server
		publicPath: '/j/'
		// necessary for HMR to know where to load the hot update chunks
	},

	//	context: resolve(__dirname, ''),
	context: resolve(__dirname),
	//like working dir, root dir

	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	},

	module: {
		rules: [{
			test: [/\.js$/],
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['es2015', 'react']
				}
			}],
			exclude: /(node_modules|bower_components)/
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader?modules'
			],
			exclude: []
		}],
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally

		new webpack.NamedModulesPlugin(),
		// prints more readable module names in the browser console on HMR updates

		//we should use --miimize as build arg
		// new webpack.optimize.UglifyJsPlugin({
		// 	// minimize: true
		// 	sourceMap: true
		// })
	],
};