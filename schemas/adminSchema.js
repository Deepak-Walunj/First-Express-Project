const Joi = require('joi');
const { EntityType } = require('../core/enum');

const registerAdminSchema = Joi.object({
    name: Joi.string().required().messages({"string.empty": "Full name is required"}),
    email: Joi.string().email().required().messages({"string.email": "Valid email is required"}),
    password: Joi.string().min(6).required().messages({"string.min": "Password must be at least 6 characters long", "string.empty": "Password is required"}),
    entity_type: Joi.string().valid(EntityType.ADMIN).required().messages({"any.only": "Entity type must be ADMIN", "string.empty": "Entity type is required"}),
})

module.exports = {
    registerAdminSchema
}