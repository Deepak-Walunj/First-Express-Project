const {MongoClient} = require('mongodb')
const { MONGODB_URL, MONGODB_DB_NAME } = require('../settings');
const { initializeCollections, checkCollectionHealth } = require('./databaseInit');
const logger = require('./logger')

let client
let db

async function connectDB(){
    try{
        client = new MongoClient(MONGODB_URL)
        await client.connect();
        db = client.db(MONGODB_DB_NAME);

        await initializeCollections(db)
        if (!(await checkCollectionHealth(db))){
            throw new Error('Database health check failed');
        }
        logger.info(`Connected to mongoDb: ${MONGODB_URL}`)
    }catch(err){
        logger.error(`DB connection failed ${err}`)
        disconnectDB()
        throw err
    }
}

async function disconnectDB() {
    if (client) {
        client.close();
        client = null;
        db = null;
        logger.info('Disconnected from MongoDB');
    }
}

function getDB() {
    if (!db) throw new Error('Database not connected');
    return db;
}

module.exports = { connectDB, disconnectDB, getDB };