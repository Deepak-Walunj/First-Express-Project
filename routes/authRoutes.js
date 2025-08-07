const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.send('Register hit!');
});

router.post('/login', (req, res) => {
  res.send('Login hit!');
});

module.exports = router;
