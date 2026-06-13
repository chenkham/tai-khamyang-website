import { Client, Databases } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

// Hardcoded from setup_profile_db.js for simplicity
const PROJECT_ID = '6a2c48930032e5852522';
const API_KEY = 'standard_89586b3cc98c133f5c337c1dad39924e0a2828895216977ee061d9fa1f12cb88c26c1f08c9b18ad740382c22496ffb943906380f837d803f115f2924156362179d64b9cfc68592c998e624ec8de3a1e24ff5ef24796f0f1910b7f1dcf045047c3899132e05085b29f016c68672757e38d7283ebfd62f4ed778af34c0e362d49a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DB_ID = '6a2c540700214d9640c5';
const DICTIONARY_COLLECTION_ID = '6a2c540d00050dd68ea6'; // from .env

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function updateSchema() {
  try {
    console.log('Adding new attributes to dictionary collection...');
    
    // Add status attribute with default 'approved' so existing words don't break
    await databases.createStringAttribute(DB_ID, DICTIONARY_COLLECTION_ID, 'status', 50, false, 'approved');
    console.log('✅ Added status attribute');

    await databases.createStringAttribute(DB_ID, DICTIONARY_COLLECTION_ID, 'contributorName', 255, false);
    console.log('✅ Added contributorName attribute');

    await databases.createStringAttribute(DB_ID, DICTIONARY_COLLECTION_ID, 'contributorEmail', 255, false);
    console.log('✅ Added contributorEmail attribute');

    console.log('Waiting for attributes to process...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Schema updated successfully!');
  } catch (err) {
    console.error('Failed to update schema:', err.message);
  }
}

updateSchema();
