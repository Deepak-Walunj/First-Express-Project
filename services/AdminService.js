const { setupLogging, getLogger } = require('../core/logger')
const { EntityProfileSchema } = require('../models/authModel');
const { InvalidCredentialsError } = require('../core/exception')

setupLogging();
const logger = getLogger('admin-service')

class AdminService {
    constructor({ adminRepository, auth_service }) {
        this.adminRepository = adminRepository;
        this.auth_service = auth_service;
    }

    async registerAdmin(data) {
        const admin = await this.auth_service.registerEntity(data)
        const { error, value } = EntityProfileSchema.validate({
            userId: admin.userId,
            full_name: data.name,
            email: data.email,
        }, { stripUnknown: true });
        if (error) {
            throw new InvalidCredentialsError(error.message, 400, 'VALIDATION_ERROR', error.details);
        }
        logger.info(`Creating admin profile with data: ${JSON.stringify(value)}`);
        const profile = await this.adminRepository.createProfile(value);
        return profile
    }
}

module.exports = AdminService;