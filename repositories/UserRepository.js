const { setupLogging, getLogger } = require('../core/logger');

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

    // async findById(id) {
    //     return await this.UserModel.findById(id);
    // }

}

module.exports = UserRepository;