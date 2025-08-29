const {EntityType} = require('../core/enum')
const { UserRegisterRequest } = require('../schemas/authSchema');
const { UserProfileSchema } = require('../models/userModel');

class UserService {
    constructor({userRepository, auth_service}) {
        this.userRepository = userRepository;
        this.auth_service = auth_service;
    }

    async registerUser(data){
        const user_auth_data = UserRegisterRequest.validate(
            name= data.name,
            email= data.email,
            password= data.password,
            entity_type= EntityType.USER
        );
        if (user_auth_data.error) {
        throw new Error(user_auth_data.error.message);
        }
        user = await this.auth_service.registerUser(user_auth_data.value);
        profile_schema = UserProfileSchema.validate({
            userId: user._id,
            full_name: data.full_name,
            email: data.email,
        });
        profile = await self.userRepository.createProfile(profile_schema.value);
    }
}

module.exports = UserService;