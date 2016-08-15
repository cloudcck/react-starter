const express = require('express');
module.exports = (() => {
  let router = express.Router();
  router.get('/', (req, res) => {
    res.send({ Code: 0, Message: 'HelloWorld' });
  });
  return router;
})();

