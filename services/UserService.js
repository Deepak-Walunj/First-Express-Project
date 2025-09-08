const { EntityProfileSchema } = require('../models/authModel');
const { InvalidCredentialsError } = require('../core/exception');
const { setupLogging, getLogger } = require('../core/logger');

setupLogging();
const logger = getLogger("user-service");

class UserService {
    constructor({userRepository, auth_service}) {
        this.userRepository = userRepository;
        this.auth_service = auth_service;
    }

    async registerUser(data){
    const user = await this.auth_service.registerEntity(data);
    const {error, value} = EntityProfileSchema.validate({
        userId: user.userId,
        full_name: data.name,
        email: data.email,
    }, { stripUnknown: true });
    if (error) {
        throw new InvalidCredentialsError(error.message, 400, 'VALIDATION_ERROR', error.details);
    }
    const profile = await this.userRepository.createProfile(value);
    return profile
    }

    async getUserProfile(userId) {
        const profile = await this.userRepository.findUserByUserId( userId );
        return profile;
    }
}

module.exports = UserService;