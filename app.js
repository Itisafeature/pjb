const express = require('express');

const app = express();

const router = express.Router();

router.route('/').get(function (req, res, next) {
  console.log('here');
  res.status(200).send('Hello World');
});

app.use('/', router);

module.exports = app;
