const { required } = require("joi");


class AuthRepository {
    constructor(collection) {
        this.collection = collection;
    }

    async findByEmail(email){
        return this.collection.findOne({email: email});
    }

    async createUser(data){
        const required_fields = ['hashed_password', 'entity_type']
        const missing_fields = required_fields.filter(field => !(field in data));
        if (missing_fields.length > 0) {
        throw new Error(`Missing required fields: ${missing_fields.join(', ')}`);
        }
        const result = await this.collection.insertOne(data);
        return { ...data, _id: result.insertedId };
    }
}

module.exports = AuthRepository;