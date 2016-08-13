const express = require('express');
const open = require('open');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

const app = express();
const PROJECT_CONFIG = require('./config/PROJECT_CONFIG');

app.use(express.static(PROJECT_CONFIG.PATH.DIST));

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  fileName: 'bundle.js',
  publicpath: '/',
  status: {
    colors: true
  },
  historyApiFallback: true
}));
app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}));





const port = 4000;
app.listen(port, () => {
  let url = `http://localhost:${port}`;
  console.log(`Example app listening ${url}`);
  open(url);
});




