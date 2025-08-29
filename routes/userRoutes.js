const express = require('express');
const router = express.Router();
const { setupLogging, getLogger } = require('../core/logger');
const { getUserService } = require('../core/deps');
const { ValidationError } = require('../core/exception.js')
const { registerUserSchema } = require('../schemas/userSchema');

setupLogging();
const logger = getLogger("user-router");

router.post('/register', async (req, res, next) => {
  const userService = getUserService()
  const { error, value } = registerUserSchema.validate(req.body);
  if (error){
    return next(new ValidationError(error.message, 400, 'VALIDATION_ERROR'));
  }
  try{
    const user = await userService.registerUser(value);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    })
  }catch(err){
    logger.error({ err }, "Error registering user");
    return next(err);
  }
});

module.exports = router;