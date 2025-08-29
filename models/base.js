// models/base.js

function withBaseSchema(schemaDefinition = {}) {
  return {
    ...schemaDefinition,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

module.exports = {
  withBaseSchema,
};
