const webpack = require('webpack');

const PROJECT_CONFIG = require('../PROJECT_CONFIG');

const webpackConfig = {
  context: PROJECT_CONFIG.PATH.SRC,

  devtool: 'eval',
  entry: {
    bundle: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      PROJECT_CONFIG.PATH.SRC + '/index.js']
  },
  output: {
    path: PROJECT_CONFIG.PATH.DIST,
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot','babel']
      },
      {
        test: /\.html?$/,
        exclude: /node_modules/,
        loaders: ['file?name=[path][name].[ext]']
      }
    ]
  },
  resolveLoader: {
    root: [PROJECT_CONFIG.PATH.NODE_MODULES]
  },
  resolve: {
    root: [PROJECT_CONFIG.PATH.NODE_MODULES]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(PROJECT_CONFIG.PATH.SRC) === -1;
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = webpackConfig;


