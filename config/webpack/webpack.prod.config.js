const webpack = require('webpack');

const PROJECT_CONFIG = require('../PROJECT_CONFIG');

const webpackConfig = {
  context: PROJECT_CONFIG.PATH.SRC,
  devtool: 'source-map',
  entry: {
    bundle: PROJECT_CONFIG.PATH.SRC + '/index.js'
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
        loaders: ['babel']
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(PROJECT_CONFIG.PATH.SRC) === -1;
      }
    })
  ]
};

module.exports = webpackConfig;


