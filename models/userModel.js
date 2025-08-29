const { withBaseSchema } = require("./base");

const UserProfileSchema = withBaseSchema({
  userId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  full_name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
});

module.exports = { UserProfileSchema } ;
