/**
 * This file contains 6 functions:
 * 
 * - getOAuth2Client(): Obtains an OAuth2 client for authentication.
 * - extractConfirmationLink(emailContent): Extracts the confirmation link from the email content.
 * - extractApiKey(emailContent): Extracts the API Key from the email content.
 * - fetchApiKey(imap, userEmail): Searches and retrieves the API Key from the registration email.
 * - confirmAndRetrieveAPIKey(): Main function to confirm and obtain the API Key.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// imap is used to connect to the email server
const Imap = require('imap'); 
import { simpleParser } from 'mailparser';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
//cheerio is used to parse HTML content
import { load } from 'cheerio'; 
import { chromium } from 'playwright';
//dotenv is used to load environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getImapConfig } from './accessToken.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

export async function getOAuth2Client() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));

  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

export function extractConfirmationLink(emailContent) {
  const $ = load(emailContent);
  const linkElement = $('a').filter(function () {
    return $(this).text().includes('Confirmar generación API Key');
  }).first();
  const link = linkElement.attr('href');
  return link || '';
}

export function extractApiKey(emailContent) {
  // Delete HTML tags if any
  const plainText = emailContent.replace(/<\/?[^>]+(>|$)/g, ' ');

  // Regular expression to extract the API Key
  const regex = /Su API Key es:\s*([a-zA-Z0-9\-_.]+)/;
  const match = plainText.match(regex);
  return match ? match[1] : '';
}

export function fetchApiKey(imap, userEmail) {
  return new Promise((resolve, reject) => {
    const maxWaitTime = 5 * 60 * 1000; 
    const intervalTime = 5000; 
    let elapsedTime = 0;

    // Recursive function to search for the API Key email
    const searchForApiKey = () => {
      imap.search(['UNSEEN', ['SUBJECT', 'Alta en el servicio AEMET OpenData']], function (err, results) {
        if (err) {
          return reject(err);
        }

        if (results && results.length) {
          const f = imap.fetch(results, { bodies: '' });

          f.on('message', function (msg, seqno) {
            msg.on('body', async function (stream, info) {
              try {
                const mail = await simpleParser(stream);
                console.log('Procesando correo de alta con asunto:', mail.subject);

                const emailContent = mail.text || mail.html;
                if (emailContent) {
                  const apiKey = extractApiKey(emailContent);
                  if (apiKey) {
                    console.log('API Key extraída:', apiKey);
                    resolve(apiKey);
                  } else {
                    console.error('No se pudo extraer el API Key del correo de alta.');
                    reject(new Error('API Key no encontrada en el correo.'));
                  }
                } else {
                  console.error('El correo de alta no contiene texto ni HTML.');
                  reject(new Error('Contenido del correo no legible.'));
                }
              } catch (error) {
                imap.end();
                reject(error);
              }
            });
          });

          f.once('error', function (err) {
            return reject(err);
          });

          f.once('end', function () {
           
          });
        } else if (elapsedTime < maxWaitTime) {
          elapsedTime += intervalTime;
          setTimeout(searchForApiKey, intervalTime);
        } else {
          reject(new Error('Tiempo de espera agotado para recibir el correo de alta.'));
        }
      });
    };
// Call the recursive function
    searchForApiKey();
  });
}

export async function confirmAndRetrieveAPIKey() {
  const imapConfig = await getImapConfig();

  const imap = new Imap(imapConfig);

  return new Promise((resolve, reject) => {
    imap.once('ready', function () {
      console.log('Conexión IMAP lista.');

      imap.openBox('INBOX', false, async function (err, box) {
        if (err) {
          imap.end();
          console.error('Error al abrir INBOX:', err);
          return reject(err);
        }

        console.log('MailBox "INBOX" abierta correctamente.');

        try {
          const apiKey = await fetchApiKey(imap, userEmail);
          if (apiKey) {
            console.log('API Key obtenida:', apiKey);
            resolve(apiKey);
          } else {
            reject(new Error('API Key no encontrada.'));
          }
        } catch (error) {
          console.error('Error al extraer el API Key:', error);
          reject(error);
        } finally {
          imap.end();
        }
      });
    });

    imap.once('error', function (err) {
      console.error('Error de conexión IMAP:', err);
      reject(err);
    });

    imap.once('end', function () {
      console.log('Conexión IMAP finalizada.');
    });

    imap.connect();
  });
}