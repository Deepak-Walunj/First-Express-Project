const { DuplicateRequestException, MissingRequiredFields } = require("../core/exception");
const { setupLogging, getLogger } = require('../core/logger');
const { AuthEntityFields } = require("../models/authModel");

setupLogging();
const logger = getLogger("auth-repo");
class AuthRepository {
    constructor(collection) {
        this.collection = collection;
    }

    async findByEmail(email, entity_type) {
        return this.collection.findOne({[AuthEntityFields.email]: email, [AuthEntityFields.entity_type]: entity_type});
    }

    async createAuthEntity(data){
        const required_fields = ['hashed_password', 'entity_type']
        const missing_fields = required_fields.filter(field => !(field in data));
        if (missing_fields.length > 0) {
        throw new MissingRequiredFields('Missing required fields', 400, 'MISSING_FIELDS', missing_fields);
        }
        try{
        const result = await this.collection.insertOne(data);
        return { ...data, _id: result.insertedId };
        }catch(err){
            if (err.code === 11000) {
                logger.error({ err }, "Duplicate email error");
                throw new DuplicateRequestException('User with this email already exists', 409, 'DUPLICATE_USER', err.keyValue);
            }
            throw err;
        }
    }

    async findById(userId) {
        console.info("Finding user by ID", { userId });
        const userDoc = await this.collection.findOne({[AuthEntityFields.userId] : userId }) // lean() for plain object
        if (userDoc) {
        console.info("User found", { userId: userDoc.userId });
        return userDoc; // map to DTO if needed
        }
        console.info("User not found", { userId });
        return null;
    }
}

module.exports = AuthRepository;