const webpack = require('webpack');
const _ = require('lodash');
const argv = require('yargs').default({ env: DEVELOPMENT }).argv;
const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const PROJECT_CONFIG = require('./PROJECT_CONFIG');
const env = argv.env;

const webpackConfig = {
  context: PROJECT_CONFIG.PATH.SRC,
  devtool: getDevTool(env),
  entry: getEntry(env),
  output: {
    path: PROJECT_CONFIG.PATH.DIST,
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    loaders: _.concat(getCommonLoaders(), getJsxLoader(env))
  },
  resolveLoader: {
    root: [PROJECT_CONFIG.PATH.NODE_MODULES]
  },
  resolve: {
    root: [PROJECT_CONFIG.PATH.NODE_MODULES]
  },
  plugins: _.concat(getCommonPlugins(), getEnvPlugins(env))
};

function getDevTool(env) {
  switch (env) {
    case DEVELOPMENT:
      return 'eval';
    case PRODUCTION:
    default:
      return 'source-map';
  }
}

function getEntry(env) {
  switch (env) {
    case DEVELOPMENT:
      return {
        bundle: [
          'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
          PROJECT_CONFIG.PATH.SRC + '/index.js']
      }
    case PRODUCTION:
    default:
      return { bundle: PROJECT_CONFIG.PATH.SRC + '/index.js' };
  }
}

function getCommonLoaders() {
  let htmlLoader = {
    test: /\.html?$/,
    exclude: /node_modules/,
    loaders: ['file?name=[path][name].[ext]']
  }
  return [htmlLoader];
}

function getJsxLoader(env) {
  let jsxLoader = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loaders: env === DEVELOPMENT ? ['react-hot', 'babel'] : ['babel']
  }
  return [jsxLoader];
}

function getCommonPlugins() {
  return [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(PROJECT_CONFIG.PATH.SRC) === -1;
      }
    })
  ];
}

function getEnvPlugins(env) {
  switch (env) {
    case DEVELOPMENT:
      return [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ];
    case PRODUCTION:
      return [
        new webpack.optimize.UglifyJsPlugin()
      ];
    default:
      return [];
  }
}


module.exports = webpackConfig;