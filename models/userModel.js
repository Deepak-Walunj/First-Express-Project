const { withBaseSchema } = require("./base");
const Joi = require("joi");
const {v4: uuidv4} = require("uuid");

const now = () => new Date().toISOString();

const UserProfileSchema = Joi.object({
  userId: Joi.string().default(() => uuidv4()).required(),
  full_name: Joi.string().min(2).required().messages({
    "string.empty": "Full name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "string.empty": "Email is required"
  }),
  created_at: Joi.date().default(now),
  updated_at: Joi.date().default(now),
});

module.exports = { UserProfileSchema } ;
