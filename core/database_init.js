const collections = require("./collections")

const REQUIRED_COLLECTIONS = [
    collections.ADMINS,
    collections.USERS,
]

async function initializeCollections(db){
    const existing = await db.listCollections().toArray()
    const existingNames = existing.map(c => c.name)

    for (const name of REQUIRED_COLLECTIONS){
        if ( !existingNames.includes(name)){
            await db.createCollection(name);
            console.log(`Created collection: ${name}`);
        }
        await createIndexes(db, name)
    }
}

async function createIndexes(db, name){
    const collection = db.collection(name)
    if (name === collections.AUTH_USERS){
        await collection.createIndex({userId:1}, {unique:true})
        await collection.createIndex({ email: 1 }, { unique: true });
    }
    else{
        await collection.createIndex({ userId: 1 }, { unique: true });
    }
}

async function checkCollectionHealth(db) {
    const existing = await db.listCollections().toArray();
    const existingNames = existing.map(c => c.name);

    for (const name of REQUIRED_COLLECTIONS) {
        if (!existingNames.includes(name)) return false;
    }
    return true;
}

module.exports = { initializeCollections, checkCollectionHealth };