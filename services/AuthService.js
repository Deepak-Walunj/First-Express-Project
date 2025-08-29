const {InvalidCredentialsError, DuplicateRequestException} = require('../core/exception');
const { EntityRegisterSchema } = require('../schemas/authSchema');
const { AuthUserSchema } = require('../models/authModel');
const { v4: uuidv4 } = require("uuid");
const { setupLogging, getLogger } = require('../core/logger');
const bcrypt = require('bcrypt');

setupLogging();
const logger = getLogger("auth-service");
class AuthService {
    constructor({ authRepository }) {
        this.authRepository = authRepository;
    }
    async registerUser(data) {
        const { error, value } = EntityRegisterSchema.validate({
            name: data.name,
            email: data.email,
            password: data.password,
            entity_type: data.entity_type
        });
        if (error) {
            throw new InvalidCredentialsError(error.message);
        }
        const existingUser = await this.authRepository.findByEmail(data.username);
        logger.info(`Existing user check for email ${data.email}: ${existingUser}`);
        if (existingUser) {
            throw new DuplicateRequestException('User already exists');
        }
        // const hashedPassword = await bcrypt.hash(value.password, 10);
        const auth_user = AuthUserSchema.validate({
            userId:uuidv4(),
            email: value.email,
            hashed_password: value.password, 
            entity_type: value.entity_type
        }, { stripUnknown: true });
        logger.info(`Creating user with data: ${JSON.stringify(auth_user.value)}`);
        const newUser = await this.authRepository.createUser(auth_user.value);
        logger.info(`User registered with ID: ${newUser._id} in AUTH_USER collection`);
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