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
    path: path.join(__dirname, 'dist'),
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
	new ExtractTextPlugin('styles.css')
  ],
  module: {
    loaders: [
	  {
      	test: /\.js$/,
      	loaders: ['babel'],
      	include: path.join(__dirname, 'src')
	  },
	  {
		test: /\.styl$/,
   		loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!stylus')
	  }
	]
  },
  postcss: function () {
    return [precss, autoprefixer];
  }
};
