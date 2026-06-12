import { Client, Account, Databases } from 'appwrite';

// Initialize the Appwrite Client
export const client = new Client();

// Environment variables are typically prefixed with VITE_ in Vite apps
// We fall back to empty strings so it doesn't crash before env vars are added
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

if (APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
} else {
  console.warn('Appwrite Project ID is missing. Please set VITE_APPWRITE_PROJECT_ID in your .env file.');
}

// Export the services we need
export const account = new Account(client);
export const databases = new Databases(client);

// Database configuration constants (to be filled by user later)
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const DICTIONARY_COLLECTION_ID = import.meta.env.VITE_APPWRITE_DICTIONARY_COLLECTION_ID || '';
