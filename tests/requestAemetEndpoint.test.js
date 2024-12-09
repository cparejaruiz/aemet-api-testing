import { test, expect } from '@playwright/test';
import { fetchApiKey, getOAuth2Client } from '../pages/retrieveEmailInfo.js';
import Imap from 'imap';
import axios from 'axios';

test.describe('AEMET API Endpoint Tests', () => {
    test('should fetch data from AEMET API', async () => {
    // Get the OAuth2 client
    const oAuth2Client = await getOAuth2Client();
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const userEmail = 'newautomailer@gmail.com'; 
    const xoauth2Token = Buffer.from(
      `user=${userEmail}\x01auth=Bearer ${accessToken}\x01\x01`,
      'utf-8'
    ).toString('base64');

    const imapConfig = {
      user: userEmail,
      xoauth2: xoauth2Token,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { servername: 'imap.gmail.com' },
    };

    const imap = new Imap(imapConfig);

        return new Promise((resolve, reject) => {
            imap.once('ready', function () {
                imap.openBox('INBOX', false, async function (err) {
                    if (err) {
                        imap.end();
                        console.error('Error opening INBOX:', err);
                        return reject(err);
                    }

                    try {
                        // Call fetchApiKey after opening INBOX
                        const apiKey = await fetchApiKey(imap, userEmail);
                        expect(apiKey).toBeTruthy();
                        console.log('API Key:', apiKey);

                        // Build the request URL
                        const startDate = '2024-01-01T15:30:00UTC';
                        const endDate = '2024-01-01T15:35:00UTC';
                        const stationId = '89064';
                        const requestUrl = `https://opendata.aemet.es/opendata/api/antartida/datos/fechaini/${encodeURIComponent(startDate)}/fechafin/${encodeURIComponent(endDate)}/estacion/${stationId}?api_key=${apiKey}`;

                        // Make the GET request to the AEMET API
                        const response = await axios.get(requestUrl);

                        // Verify the HTTP status code
                        expect(response.status).toBe(200);
                        console.log('HTTP Status Code:', response.status);

                        // Verify the structure and content of the response data
                        expect(response.data).toHaveProperty('datos');
                        expect(response.data).toHaveProperty('metadatos');
                        console.log('Response Data:', response.data);

                        // Get the actual data from the URL provided in 'datos'
                        const dataResponse = await axios.get(response.data.datos);
                        const data = dataResponse.data;

                        // Verify that the data contains the expected fields
                        expect(Array.isArray(data)).toBeTruthy();
                        expect(data.length).toBeGreaterThan(0);
                        console.log('Data Length:', data.length);

                        const record = data[0];
                        expect(record).toHaveProperty('fhora'); // Date and time
                        expect(record).toHaveProperty('temp'); // Temperature
                        expect(record).toHaveProperty('pres'); // Pressure
                        expect(record).toHaveProperty('vel');  // Wind speed
                        console.log('First Record:', record);

                        // Verify that the 'fint' field respects the CET/CEST timezone
                        const datetime = new Date(record.fhora);
                        const timezoneOffset = datetime.getTimezoneOffset();
                        // CET/CEST timezoneOffset is -60 or -120 minutes
                        expect(timezoneOffset === -60 || timezoneOffset === -120).toBeTruthy();

                        resolve();
                    } catch (error) {
                        console.error('Error extracting the API Key:', error);
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
