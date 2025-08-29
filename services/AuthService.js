const {InvalidCredentialsError, DuplicateRequestException} = require('../core/exception');
const { AuthUserSchema } = require('../models/authModel');

class AuthService {
    constructor({ authRepository }) {
        this.authRepository = authRepository;
    }
    async registerUser(data) {
        if (!data.email){   
            throw new InvalidCredentialsError('Email is required');
        }
        const existingUser = await this.authRepository.findByEmail(data.username);
        if (existingUser) {
            throw new DuplicateRequestException('User already exists');
        }
        const auth_user = AuthUserSchema.validate({
            userId: require("uuid").v4(),
            email: data.email,
            hashed_password: data.hashed_password,
            entity_type: data.entity_type
        });
        const newUser = await this.authRepository.createUser(data);
        return newUser;
    }
    // async validateUser(username, password) {
    //     const user = await this.authRepository.findByUsername(username);
    //     if (user && user.password === password) {
    //         return user;
    //     }
    //     return null;
    // }
}

module.exports = AuthService;