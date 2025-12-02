require('dotenv').config();
const { MongoClient } = require('mongodb');

async function listCollections() {
    const client = new MongoClient(process.env.DATABASE_URL);
    try {
        await client.connect();
        const db = client.db();
        console.log('Connected to database:', db.databaseName);

        const collections = await db.listCollections().toArray();
        console.log('Collections in database:');
        collections.forEach(c => console.log(` - ${c.name}`));

        // Count documents in each collection
        for (const c of collections) {
            const count = await db.collection(c.name).countDocuments();
            console.log(`   Count in ${c.name}: ${count}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

listCollections();
