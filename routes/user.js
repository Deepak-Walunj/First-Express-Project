const express = require('express');
const router = express.Router();
const { setupLogging, getLogger } = require('../core/logger');
const {doesExist} = require('../middleware/utilityFunction')
setupLogging();
const logger = getLogger("user-router");

router.post('/register', (req, res) => {
  const username=req.body.username;
  const password=req.body.password;
  if (username && password){
    if(!doesExist(username)){
      USERS.push({
        "username": username,
        "password": password,
      })
      loggerinfo("User registered!")
      return res.status(200).json({messge: "User registered successfully"})
    }else{
      return res.status(404).json({message: "User already exists"})
    }
  }
  return res.status(404).json({message:"Unable to register"})
});

router.post('/login', (req, res) => {
  res.send('Login hit!');
});

module.exports = router;
