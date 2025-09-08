const express = require('express')
const router = express.Router()
const { setupLogging, getLogger } = require('../core/logger')
const { getAdminService } = require('../core/deps')
const { registerAdminSchema, StandardResponse } = require('../schemas/adminSchema')
const { ValidationError } = require('../core/exception')
const allowedEntities = require('../middleware/authMiddleware')
const { EntityType } = require('../core/enum')

setupLogging()
const logger = getLogger('admin-routes')

router.post('/register', async (req, res, next) => {
    const adminService = getAdminService()
    const { error, value } = registerAdminSchema.validate(req.body)
    if (error) {
        return next(new ValidationError(error.message, 400, 'VALIDATION_ERROR', error.details))
    }
    const admin = await adminService.registerAdmin(value)
    return res.json (new StandardResponse(true, 'Admin registered successfully', admin))
})

router.get('/me', allowedEntities(EntityType.ADMIN), async (req, res, next) => {
  const adminService = getAdminService();
  const userId = req.user.userId
  const profile = await adminService.getUserProfile(userId)
  logger.info(`Fetched profile for user: ${profile}`);
  return res.json(new StandardResponse(true, 'User profile fetched successfully', profile))
})

router.delete('/me', allowedEntities(EntityType.ADMIN), async (req, res, next) => {
  const adminService = getAdminService()
  const userId = req.user.userId
  const result = await adminService.deleteUser(userId)
  if (!result){
    logger.error(`Failed to delete user with ID: ${userId}`);
  }
  logger.info(`Deleted user with ID: ${userId}`);
  return res.json(new StandardResponse(true, 'Admin deleted successfully'))
})

router.get('/users', allowedEntities(EntityType.ADMIN), async (req, res, next) => {
    return res.json (new StandardResponse(true, 'Authentication working', null))
})

module.exports = router