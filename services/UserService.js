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
        const user = await this.auth_service.registerEntity(data);
        const {error, value} = UserProfileSchema.validate({
            userId: user.userId,
            full_name: data.name,
            email: data.email,
        }, { stripUnknown: true });
        if (error) {
            throw new InvalidCredentialsError(error.message);
        }
        logger.info(`Creating user profile with data: ${JSON.stringify(value)}`);
        const profile = await this.userRepository.createProfile(value);
        return profile
    }catch(err){
        logger.error({ err }, "Error in registerUser");
        throw err;
    }
}
}
module.exports = UserService;