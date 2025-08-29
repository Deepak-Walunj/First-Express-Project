const { getDB, connectDB} = require('./database')
const collections = require('./collections')
const { setupLogging, getLogger } = require('../core/logger');
setupLogging();
const logger = getLogger("deps");
logger.info('In deps.js');
const AuthRepository = require('../repositories/authRepository');
const UserRepository = require('../repositories/userRepository');
// const AdminRepository = require('../repositories/AdminRepository');

const AuthService = require('../services/authService');
const UserService = require('../services/userService');
// const AdminService = require('../services/AdminService');

let dependencyStorage = null;

class DependencyStorage{
    constructor(db){
        if (!db) logger.error('Database not initialized');
        this.userRepo = new UserRepository(db.collection(collections.USERS));
        this.authRepo = new AuthRepository(db.collection(collections.AUTH_USERS));
        // this.adminRepo = new AdminRepository(db.collection(collections.ADMINS));
        
        this.authService = new AuthService({ authRepository: this.authRepo });
        this.userService = new UserService({ userRepository: this.userRepo, auth_service: this.authService });
        // this.adminService = new AdminService({ adminRepository: this.adminRepo})
        }
    getAuthRepository() {
        return this.authRepo;
    }
    getUserRepository() {
        return this.userRepo;
    }
    // getAdminRepository() {
    //     return this.adminRepo;
    // }
    getAuthService() {
        return this.authService;
    }
    getUserService() {
        return this.userService;
    }
    // getAdminService() {
    //     return this.adminService;
    // }
}

async function initializeDependencies() {
  await connectDB();
  const db = getDB();
  dependencyStorage = new DependencyStorage(db);
}

function getAuthRepository() {
  if (!dependencyStorage) throw new Error('Dependencies not initialized');
  return dependencyStorage.getAuthRepository();
}
function getUserRepository() {
  if (!dependencyStorage) throw new Error('Dependencies not initialized');
  return dependencyStorage.getUserRepository();
}
// function getAdminRepository() {
//   if (!dependencyStorage) throw new Error('Dependencies not initialized');
//   return dependencyStorage.getAdminRepository();
// }
function getAuthService() {
  if (!dependencyStorage) throw new Error('Dependencies not initialized');
  return dependencyStorage.getAuthService();
}
function getUserService() {
  if (!dependencyStorage) throw new Error('Dependencies not initialized');
  return dependencyStorage.getUserService();
}
// function getAdminService() {
//   if (!dependencyStorage) throw new Error('Dependencies not initialized');
//   return dependencyStorage.getAdminService();
// }

module.exports = {
  initializeDependencies,
  getAuthRepository,
  getUserRepository,
  // getAdminRepository,
  getAuthService,
  getUserService,
  // getAdminService
};
