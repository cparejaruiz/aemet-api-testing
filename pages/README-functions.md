## Functions Documentation

### getOAuth2Client
Obtains an OAuth2 client using credentials and token stored in JSON files.

### extractConfirmationLink
Extracts the confirmation link from an email content.

### extractApiKey
Extracts the API key from an email content.

### confirmAndRetrieveAPIKey
Confirms and retrieves an API key by processing an email. This function:
1. Obtains an OAuth2 access token.
2. Configures an IMAP connection using XOAUTH2.
3. Searches for an email with a specific subject.
4. Extracts a confirmation link from the email content.
5. Uses Playwright to visit the confirmation link.
6. Waits for a confirmation message.
7. Extracts the API key from a subsequent email.

### fetchApiKey
Searches for and extracts the API key from a confirmation email.
