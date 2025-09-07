const express = require('express');
const router = express.Router();
const { setupLogging, getLogger } = require('../core/logger');
const { getUserService } = require('../core/deps');
const { ValidationError } = require('../core/exception.js')
const { registerUserSchema } = require('../schemas/userSchema');
const { StandardResponse } = require('../schemas/adminSchema');

setupLogging();
const logger = getLogger("user-router");

router.post('/register', async (req, res, next) => {
  const userService = getUserService()
  const { error, value } = registerUserSchema.validate(req.body);
  if (error){
    return next(new ValidationError(error.message, 400, 'VALIDATION_ERROR', error.details));
  }
  const user = await userService.registerUser(value);
  return res.json(new StandardResponse(true, 'User registered successfully', user))
});

module.exports = router;