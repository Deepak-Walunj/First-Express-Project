const Joi = require('joi');
const { EntityType } = require('../core/enum');
const {v4: uuidv4} = require("uuid");

const now = () => new Date().toISOString();

const AuthUserSchema  = Joi.object({
  userId: Joi.string().default(()=>uuidv4).description("unique user ID"), // can be auto-generated
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "string.empty": "Email is required"
  }),
  hashed_password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required"
  }),
  entity_type: Joi.string()
    .valid(...Object.values(EntityType))
    .required()
    .messages({
      "any.only": `Entity type must be one of: ${Object.values(EntityType).join(', ')}`,
      "string.empty": "Entity type is required"
    }),
  createdAt: Joi.date().default(now).description("Timestamp when the user was created"),
  updatedAt: Joi.date().default(now).description("Timestamp when the user was last updated"),
});

module.exports = {
  AuthUserSchema
};
