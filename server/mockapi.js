const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PROJECT_CONFIG = require('../config/PROJECT_CONFIG');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use((req, res, next) => {
    console.info(`[${req.method}] ${req.url} `);
    console.info(`\tquery :${JSON.stringify(req.query)}`);
    console.info(`\tparams:${JSON.stringify(req.params)}`);
    console.info(`\tbody  :${JSON.stringify(req.body)}`);
    next();
});
app.use('/api/helloworld', require('./mockapi/helloworld'));
app.use('/api/todos', require('./mockapi/todos'));
app.use('/api/footprint', require('./mockapi/Footprint'))

const port = PROJECT_CONFIG.PORT.MOCKAPI;
app.listen(port, () => {
    let url = `http://localhost:${port}`;
    console.info(`Mock API start with ${url}`);
});





