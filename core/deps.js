const express = require('express');
const { getDB, connectDB} = require('./database')
const collections = require('./collections')
const { setupLogging, getLogger } = require('../core/logger');
setupLogging();
const logger = getLogger("main");
logger.info('In deps.js');
// const AuthRepository = require('../repositories/AuthRepository');
// const CandidateRepository = require('../repositories/CandidateRepository');

// const AuthService = require('../services/AuthService');
// const CandidateService = require('../services/CandidateService');

let dependencyStorage = null;

class DependencyStorage{
    constructor(db){
        if (!db) logger.error('Database not initialized');
        // this.authRepo = new AuthRepository(db.collection(collections.AUTH_USERS));
        // this.candidateRepo = new CandidateRepository(db.collection(collections.CANDIDATES));
        
        // this.authService = new AuthService({ authRepository: this.authRepo });
        // this.candidateService = new CandidateService({ candidateRepository: this.candidateRepo });
        }
    // getAuthRepository() {
    //     return this.authRepo;
    // }
    // getCandidateRepository() {
    //     return this.candidateRepo;
    // }
    // getAuthService() {
    //     return this.authService;
    // }
    // getCandidateService() {
    //     return this.candidateService;
    // }
}

async function initializeDependencies() {
  await connectDB();
  const db = getDB();
  dependencyStorage = new DependencyStorage(db);
}

// function getAuthRepository() {
//   if (!dependencyStorage) throw new Error('Dependencies not initialized');
//   return dependencyStorage.getAuthRepository();
// }
// function getAuthService() {
//   if (!dependencyStorage) throw new Error('Dependencies not initialized');
//   return dependencyStorage.getAuthService();
// }

module.exports = {
  initializeDependencies,
//   getAuthRepository,
//   getAuthService,
};
