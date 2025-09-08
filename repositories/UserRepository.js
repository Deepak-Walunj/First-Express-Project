const { setupLogging, getLogger } = require('../core/logger');
const { UserProfileFields, UserProfileSchema } = require('../models/userModel');
const { UnprocessableEntityError } = require('../core/exception');
setupLogging();
const logger = getLogger("user-repo");

class UserRepository {
    constructor(collection) {
        this.collection = collection;
    }

    async createProfile(userData) {
        const result = await this.collection.insertOne(userData);
        return { ...userData, _id: result.insertedId };
    }

    // async findByEmail(email) {
    //     return await this.UserModel.findOne({ email });
    // }

    async findUserByUserId(userId) {
        const result = await this.collection.findOne({ [UserProfileFields.userId]: userId });
        const { error, value } = UserProfileSchema.validate(result, { stripUnknown: true });
        if (error) {
            throw new UnprocessableEntityError(error.message, 422, 'UNPROCESSIBLE_ENTITY', error.details);
        }
        return value;
    }

}

module.exports = UserRepository;