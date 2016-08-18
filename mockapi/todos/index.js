const express = require('express');
const faker = require('faker');
const uuid = require('uuid');
module.exports = (() => {
  let router = express.Router();
  router.get('/', (req, res) => {
    let todos = [];
    for (let x = 0; x < 5; x++) {
      let text = `${faker.hacker.verb()} ${faker.hacker.noun()} `;
      todos.push({
        id: uuid.v4(),
        text,
        completed: false
      });
    }
    res.send({ Code: 0, Message: 'OK', Data: todos });
  });

  return router;
})();