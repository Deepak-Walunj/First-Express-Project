const { setupLogging, getLogger } = require('../core/logger')
const { AdminProfileSchema, AdminProfileFields } = require('../models/adminModel')
const { UnprocessableEntityError, NotFoundError } = require('../core/exception');

setupLogging()
const logger = getLogger('admin-repo')

class AdminRepository{
    constructor(collection){
        this.collection = collection;
    }

    async createProfile(adminData){
        const result = await this.collection.insertOne(adminData);
        return { ...adminData, _id: result.insertedId }
    }

    async findUserByUserId(userId) {
        const result = await this.collection.findOne({ [AdminProfileFields.userId]: userId });
        if (!result) {
            throw new NotFoundError('User not found', 404, 'USER_NOT_FOUND', { userId });
        }
        const { error, value } = AdminProfileSchema.validate(result, { stripUnknown: true });
        if (error) {
            throw new UnprocessableEntityError(error.message, 422, 'UNPROCESSIBLE_ENTITY', error.details);
        }
        return value;
    }

    async deleteUserByUserId(userId) {
        const result = await this.collection.deleteOne({ [AdminProfileFields.userId]: userId });
        if (result.deletedCount === 0) {
            throw new NotFoundError('User not found', 404, 'USER_NOT_FOUND', { userId });
        }
        return true;
    }
}

module.exports = AdminRepository;