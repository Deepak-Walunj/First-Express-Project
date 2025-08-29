const { withBaseSchema } = require("./base");
const { EntityType } = require("../core/enum");
const { v4: uuidv4 } = require('uuid');

const AuthUserSchema = withBaseSchema({
  userId: {
    type: String,
    default: uuidv4,
    index: true,
    unique: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // allow null
    lowercase: true,
    trim: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  entity_type: {
    type: String,
    enum: Object.values(EntityType),
    required: true
  }
});


module.exports = {
    AuthUserSchema,
}