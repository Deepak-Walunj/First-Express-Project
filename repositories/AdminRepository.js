const { setupLogging, getLogger } = require('../core/logger')

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
}

module.exports = AdminRepository;