import { getOAuth2Client } from './retrieveEmailInfo.js';
import Imap from 'imap';
import dotenv from 'dotenv';

//dotenv is used to read the .env file
dotenv.config();


/**
 * Retrieves the IMAP configuration for accessing a Gmail account using OAuth2.
 *
 * @async
 * @function getImapConfig
 * @returns {Promise<Object>} The IMAP configuration object.
 * @property {string} user - The email address of the user.
 * @property {string} xoauth2 - The OAuth2 token for authentication.
 * @property {string} host - The IMAP server host.
 * @property {number} port - The port number for the IMAP server.
 * @property {boolean} tls - Indicates if TLS should be used.
 * @property {Object} tlsOptions - Additional TLS options.
 * @property {string} tlsOptions.servername - The server name for TLS options.
 */
export async function getImapConfig() {
  const oAuth2Client = await getOAuth2Client();
  const accessTokenResponse = await oAuth2Client.getAccessToken();
  const accessToken = accessTokenResponse.token;

  const userEmail = process.env.USER_EMAIL
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

  return imapConfig;
}
