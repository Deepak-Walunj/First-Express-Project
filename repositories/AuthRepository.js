const { DuplicateRequestException } = require("../core/exception");
const { setupLogging, getLogger } = require('../core/logger');

setupLogging();
const logger = getLogger("auth-repo");
class AuthRepository {
    constructor(collection) {
        this.collection = collection;
    }

    async findByEmail(email){
        return this.collection.findOne({email: email});
    }

    async createAuthEntity(data){
        const required_fields = ['hashed_password', 'entity_type']
        const missing_fields = required_fields.filter(field => !(field in data));
        if (missing_fields.length > 0) {
        throw new Error(`Missing required fields: ${missing_fields.join(', ')}`);
        }
        try{
        const result = await this.collection.insertOne(data);
        return { ...data, _id: result.insertedId };
        }catch(err){
            if (err.code === 11000) {
                logger.error({ err }, "Duplicate email error");
                throw new DuplicateRequestException('User with this email already exists', err.keyValue);
            }
            throw err;
        }
    }
}

module.exports = AuthRepository;