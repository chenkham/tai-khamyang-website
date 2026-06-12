/**
 * Appwrite Database Initialization Script
 * 
 * To run this script:
 * 1. Install node-appwrite: `npm install node-appwrite`
 * 2. Set your environment variables below (or pass them in terminal)
 * 3. Run: `node setup_appwrite.js`
 * 4. After running, take the new DATABASE_ID and COLLECTION_ID and put them in your app's .env file:
 *    VITE_APPWRITE_PROJECT_ID="your-project-id"
 *    VITE_APPWRITE_DATABASE_ID="generated-database-id"
 *    VITE_APPWRITE_DICTIONARY_COLLECTION_ID="generated-collection-id"
 */

import { Client, Databases, ID } from 'node-appwrite';

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID_HERE';
const API_KEY = process.env.APPWRITE_API_KEY || 'YOUR_API_KEY_HERE';

const client = new Client();
client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function setup() {
    try {
        console.log('Creating Dictionary Database...');
        // Create Database
        const db = await databases.create(
            ID.unique(), 
            'Tai Khamyang App'
        );
        const dbId = db.$id;
        console.log(`✅ Database created! ID: ${dbId}`);

        console.log('Creating Words Collection...');
        // Create Collection
        const collection = await databases.createCollection(
            dbId, 
            ID.unique(), 
            'words'
        );
        const collectionId = collection.$id;
        console.log(`✅ Collection created! ID: ${collectionId}`);

        // Add Attributes
        console.log('Adding attributes...');
        await databases.createStringAttribute(dbId, collectionId, 'romanized_word', 255, true);
        await databases.createStringAttribute(dbId, collectionId, 'english_word', 255, true);
        await databases.createStringAttribute(dbId, collectionId, 'assamese_word', 255, true);
        await databases.createStringAttribute(dbId, collectionId, 'khamyang_letter_word', 255, false);
        await databases.createStringAttribute(dbId, collectionId, 'sentence', 1000, false);
        await databases.createStringAttribute(dbId, collectionId, 'pronunciation', 255, false);
        await databases.createStringAttribute(dbId, collectionId, 'category', 255, false);
        await databases.createStringAttribute(dbId, collectionId, 'part_of_speech', 255, false);
        
        console.log(`✅ Attributes added!`);
        console.log('\n--- SETUP COMPLETE ---');
        console.log(`Please add these to your .env file:`);
        console.log(`VITE_APPWRITE_PROJECT_ID="${PROJECT_ID}"`);
        console.log(`VITE_APPWRITE_DATABASE_ID="${dbId}"`);
        console.log(`VITE_APPWRITE_DICTIONARY_COLLECTION_ID="${collectionId}"`);

    } catch (error) {
        console.error('❌ Error during setup:', error);
    }
}

setup();
