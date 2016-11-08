const express = require('express');
const open = require('open');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const proxy = require('http-proxy-middleware');
const exec = require('child_process').exec;
const PROJECT_CONFIG = require('./config/PROJECT_CONFIG');
const app = express();

// craete child process to start up mock api server
let apiProcess = exec('nodemon ./server/mockapi.js');
apiProcess.stdout.on('data', data => console.log(data));
apiProcess.stderr.on('data', data => console.log(data));

// create the proxy for mock api
var mockapi = proxy({
    target: `http://localhost:${PROJECT_CONFIG.PORT.MOCKAPI}`, // target host
    changeOrigin: true,               // needed for virtual hosted sites
});
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
    noInfo: true,
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