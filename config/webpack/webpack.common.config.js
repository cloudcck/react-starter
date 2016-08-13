const PROJECT_CONFIG = require('../PROJECT_CONFIG');

const webpackConfig = {
  context: PROJECT_CONFIG.PATH.SRC,
  entry: {
    app: PROJECT_CONFIG.PATH.SRC + '/index.js'
  },
  output: {
    path: PROJECT_CONFIG.PATH.DIST,
    publicPath: '/',
    filename: '[name].js'
  },
  module:{
    loaders:[
      {
        test:/\.jsx?$/,
        exclude:/node_modules/,
        loaders:['babel']
      },
      {
        test:/\.html?$/,
        exclude:/node_modules/,
        loaders:['file?[path][name].[ext]']
      }
    ]
  }
};

module.exports = webpackConfig;


