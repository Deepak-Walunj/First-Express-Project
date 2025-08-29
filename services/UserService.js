const {EntityType} = require('../core/enum')
const { registerUserSchema } = require('../schemas/userSchema');
const { UserProfileSchema } = require('../models/userModel');
const { InvalidCredentialsError } = require('../core/exception');
const { setupLogging, getLogger } = require('../core/logger');

setupLogging();
const logger = getLogger("user-service");
class UserService {
    constructor({userRepository, auth_service}) {
        this.userRepository = userRepository;
        this.auth_service = auth_service;
        logger.info("UserService initialized");
    }

    async registerUser(data){
        try{
        const user = await this.auth_service.registerUser(data);
        const profile_schema = UserProfileSchema.validate({
            userId: user._id,
            full_name: data.full_name,
            email: data.email,
        });
        const profile = await this.userRepository.createProfile(profile_schema.value);
        return profile
    }catch(err){
        logger.error({ err }, "Error in registerUser");
        throw err;
    }
}
}
module.exports = UserService;