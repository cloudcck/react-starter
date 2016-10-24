const express = require('express');
const open = require('open');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const app = express();
const proxy = require('http-proxy-middleware');
const exec = require('child_process').exec;
const PROJECT_CONFIG = require('./config/PROJECT_CONFIG');

// craete child process to start up mock api server
exec('nodemon ./server/mockapi.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
const options = {
  target: `http://localhost:${PROJECT_CONFIG.PORT.MOCKAPI}`, // target host
  changeOrigin: true,               // needed for virtual hosted sites
};

// create the proxy for mock api
var mockapi = proxy(options);
app.use('/api', mockapi);


app.use(express.static(PROJECT_CONFIG.PATH.DIST));
app.use(webpackDevMiddleware(compiler, {
  hot: false,
  fileName: 'bundle.js',
  publicpath: '/',
  status: {
    colors: true
  },
  historyApiFallback: true,
  noInfo: false,
  // display no info to console (only warnings and errors)

  quiet: false,
  // display nothing to the console
}));
app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}));


const port = PROJECT_CONFIG.PORT.CLIENT;
app.listen(port, () => {
  let url = `http://localhost:${port}`;
  console.log(`Example app listening ${url}`);
  open(url);
});