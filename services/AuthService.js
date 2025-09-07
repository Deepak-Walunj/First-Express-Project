const {InvalidCredentialsError, DuplicateRequestException} = require('../core/exception');
const { EntityRegisterSchema } = require('../schemas/authSchema');
const { AuthEntitySchema } = require('../models/authModel');
const { create_access_token, create_refresh_token, hash_password, verify_password } = require('../middleware/security');
const { v4: uuidv4 } = require("uuid");
const { setupLogging, getLogger } = require('../core/logger');
const bcrypt = require('bcrypt');

setupLogging();
const logger = getLogger("auth-service");
class AuthService {
    constructor({ authRepository }) {
        this.authRepository = authRepository;
    }
    async registerEntity(data) {
        const { error, value } = EntityRegisterSchema.validate({
            name: data.name,
            email: data.email,
            password: data.password,
            entity_type: data.entity_type
        });
        if (error) {
            throw new InvalidCredentialsError(error.message, 400, 'VALIDATION_ERROR', error.details);
        }
        const existingUser = await this.authRepository.findByEmail(data.email, data.entity_type);
        if (existingUser) {
            throw new DuplicateRequestException('User already exists', 409, 'DUPLICATE_USER', { email: data.email });
        }
        const hashedPassword = await hash_password(value.password);
        const auth_user = AuthEntitySchema.validate({
            userId:uuidv4(),
            email: value.email,
            hashed_password: hashedPassword, 
            entity_type: value.entity_type
        }, { stripUnknown: true });
        logger.info(`Creating user with data: ${JSON.stringify(auth_user.value)}`);
        const newUser = await this.authRepository.createAuthEntity(auth_user.value);
        logger.info(`User registered with ID: ${newUser.userId} in AUTH_USER collection`);
        return newUser;
    }
    
    async loginEntity(data) {
        const user = await this.authRepository.findByEmail(data.email, data.entity_type);
        if (!user) {
            logger.info(`No user found for email: ${data.email}`);
            return null;
        }
        const isPasswordValid = await verify_password(data.password, user.hashed_password);
        if (!isPasswordValid) {
            logger.info(`Incorrect password for email: ${data.email}`);
            return null;
        }
        if (user.entity_type !== data.entity_type) {
            logger.info(
                `Entity type mismatch for email: ${data.email}, expected: ${user.entity_type}, received: ${data.entity_type}`
            );
            return null;
        }
        return user;
    }

    async generateTokens(user) {
        const auth_entity = AuthEntitySchema.validate(user, { stripUnknown: true });
        if (auth_entity.error) {
            throw new InvalidCredentialsError('Invalid user data', 400, 'INVALID_USER', auth_entity.error.details);
        }
        const data = {
            userId: user.userId,
            email: user.email,
            entity_type: user.entity_type
        }
        const access_token=create_access_token(data);
        const refresh_token=create_refresh_token(data);
        return { access_token, refresh_token  };
    }
}

module.exports = AuthService;