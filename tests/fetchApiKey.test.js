// fetchApiKey.test.js
import { test, expect } from '@playwright/test';
import { fetchApiKey } from '../pages/retrieveEmailInfo.js';
import { getImapConfig } from '../pages/accessToken.js';
import Imap from 'imap';
import dotenv from 'dotenv';

//dotenv is used to read the .env file
dotenv.config();


test.describe('Print API Key Tests', () => {
  test('should extract and print the API key', async () => {
    const userEmail = process.env.USER_EMAIL;
    const imapConfig = await getImapConfig();
    const imap = new Imap(imapConfig);

    return new Promise((resolve, reject) => {
      imap.once('ready', async function () {
        imap.openBox('INBOX', false, async function (err, box) {
          if (err) {
            imap.end();
            console.error('Error al abrir INBOX:', err);
            return reject(err);
          }

          try {
            // Call fetchApiKey after opening INBOX
            const apiKey = await fetchApiKey(imap, userEmail);
            expect(apiKey).toBeTruthy();
            console.log('API Key:', apiKey);
            resolve();
          } catch (error) {
            console.error('Error al extraer el API Key:', error);
            reject(error);
          } finally {
            imap.end();
          }
        });
      });

      imap.once('error', function (err) {
        console.error('IMAP Error:', err);
        reject(err);
      });

      imap.connect();
    });
  });
});