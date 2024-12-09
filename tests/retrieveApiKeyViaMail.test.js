// retrieveApiKeyViaMail.test.js
import { test, expect } from '@playwright/test';
import { confirmAndRetrieveAPIKey } from '../pages/retrieveEmailInfo.js';

test.describe('Retrieve API Key Tests', () => {
  test('should retrieve API Key from email', async () => {
    try {
      const apiKey = await confirmAndRetrieveAPIKey();
      expect(apiKey).toBeTruthy();
      console.log('API Key retrieved:', apiKey);
    } catch (error) {
      console.error('Error al obtener el API Key:', error);
      throw error; // Asegura que el test falle si hay un error
    }
  });
});