const express = require('express')
const router = express.Router()
const { setupLogging, getLogger } = require('../core/logger')
const { getAdminService } = require('../core/deps')
const { registerAdminSchema } = require('../schemas/adminSchema')
const { ValidationError } = require('../core/exception')

setupLogging()
const logger = getLogger('admin-routes')

router.post('/register', async (req, res, next) => {
    const adminService = getAdminService()
    const { error, value } = registerAdminSchema.validate(req.body)
    if (error) {
        return next(new ValidationError(error.message, 400, 'VALIDATION_ERROR', error.details))
    }
    const admin = await adminService.registerAdmin(value)
    return res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: admin
    })
})

module.exports = router