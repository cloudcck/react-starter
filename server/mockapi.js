const express = require('express');
const app = express();
const PROJECT_CONFIG = require('../config/PROJECT_CONFIG');

app.use('/api/helloworld', require('./mockapi/helloworld'));
app.use('/api/todos', require('./mockapi/todos'));

const port = PROJECT_CONFIG.PORT.MOCKAPI;
app.listen(port, () => {
  let url = `http://localhost:${port}`;
  console.info(`Mock API start with ${url}`);
});





