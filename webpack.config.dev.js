var path = require('path');
var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // necessary for hot reloading with IE:
    'eventsource-polyfill',
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    // your code:
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
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
	  	loaders: [
		  'style?sourceMap',
		  'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
		  'postcss',
		  'stylus'
	  	]
	  },
	  {
		test: /jquery-mousewheel/,
		loader: "imports?define=>false&this=>window"
	  },
	  {
		test: /malihu-custom-scrollbar-plugin/,
		loader: "imports?define=>false&this=>window"
	  }
	]
  },
  postcss: function () {
    return [precss, autoprefixer];
  }
};
