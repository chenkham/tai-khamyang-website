import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

const PROJECT_ID = '6a2c48930032e5852522';
const API_KEY = 'standard_89586b3cc98c133f5c337c1dad39924e0a2828895216977ee061d9fa1f12cb88c26c1f08c9b18ad740382c22496ffb943906380f837d803f115f2924156362179d64b9cfc68592c998e624ec8de3a1e24ff5ef24796f0f1910b7f1dcf045047c3899132e05085b29f016c68672757e38d7283ebfd62f4ed778af34c0e362d49a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DB_ID = '6a2c540700214d9640c5';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function setupProfileDb() {
  try {
    console.log('Creating saved_words collection...');
    
    // Create Collection
    const collection = await databases.createCollection(
      DB_ID,
      ID.unique(),
      'saved_words',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    
    const collectionId = collection.$id;
    console.log(`✅ Collection created with ID: ${collectionId}`);

    // Create Attributes
    console.log('Creating attributes...');
    await databases.createStringAttribute(DB_ID, collectionId, 'userId', 255, true);
    await databases.createStringAttribute(DB_ID, collectionId, 'wordId', 255, true);
    
    // Wait a moment for attributes to be available before creating index
    console.log('Waiting for attributes to be created...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create Index
    await databases.createIndex(
      DB_ID, 
      collectionId, 
      'user_word_index', 
      'unique', 
      ['userId', 'wordId'],
      ['ASC', 'ASC']
    );
    console.log('✅ Index user_word_index created');

    // Update .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent += `\nVITE_APPWRITE_SAVED_WORDS_COLLECTION_ID="${collectionId}"\n`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated');

    console.log('Done!');
  } catch (err) {
    console.error('Failed to setup DB:', err);
  }
}

setupProfileDb();
