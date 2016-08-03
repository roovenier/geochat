var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
	devtool: 'source-map',
	entry: [
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		}),
		new ExtractTextPlugin('css/styles.css')
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(['css'])
			},
			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!stylus?paths[]=node_modules&paths[]=src')
			},
			{
				test: /^jquery-mousewheel$/,
				loader: "imports?$=jquery&define=>false&this=>window"
			},
			{
				test: /^malihu-custom-scrollbar-plugin$/,
				loader: "imports?$=jquery&define=>false&this=>window"
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'file?name=images/[hash].[ext]'
			},
			{
				test: /\.svg(?:\?v=[\d.]+)?$/,
				loader: "file?name=images/[hash].[ext]"
			}
		]
	},
	postcss: function () {
		return [precss, autoprefixer];
	}
};
