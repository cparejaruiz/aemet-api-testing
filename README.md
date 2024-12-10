# Automated Testing for AEMET API

## Overview

This project automates the signup process for the AEMET API, retrieves the API key from the user's email, and validates the API key by making requests to the AEMET API endpoints. It is divided into two main parts:

1. **Part 1: Automate Signup Process**
   - **`signup.test.js`**: Automates navigating to the AEMET API portal and completing the signup process, including solving the reCAPTCHA.
   - **`fetchApiKey.test.js`**: Retrieves the API key sent to the user's email and parses the email to extract the API key.
   - **`retrieveApiKeyViaMail.test.js`**: Confirms and retrieves the API key from the email, ensuring that the complete process of obtaining the key works correctly.

2. **Part 2: Validate API Key and Data Retrieval**
   - **`requestAemetEndpoint.test.js`**: Uses the retrieved API key to make a request to the AEMET API endpoint and validates the response by:
     - Checking HTTP status codes.
     - Verifying the structure and content of the response data (fields like `temp`, `pres`, `vel`).
     - Ensuring that the datetime field respects the CET/CEST timezone.

### Comparison between `fetchApiKey.test.js` and `retrieveApiKeyViaMail.test.js`

While both `fetchApiKey.test.js` and `retrieveApiKeyViaMail.test.js` are responsible for retrieving the API key from emails, they serve different purposes:

- **`fetchApiKey.test.js`**:
  - **Purpose**: Tests the specific function `fetchApiKey` that interacts directly with the IMAP server to extract the API key from the email.
  - **Approach**: Unit test focusing on the functionality of `fetchApiKey` in isolation.

- **`retrieveApiKeyViaMail.test.js`**:
  - **Purpose**: Tests the overall process of confirming and retrieving the API key via email.
  - **Approach**: Integration test that ensures the entire flow, possibly involving multiple functions or components, works as expected.

**Recommendation**:
Maintain both tests to achieve comprehensive coverage. The unit test (`fetchApiKey.test.js`) ensures that the key extraction function works correctly, while the integration test (`retrieveApiKeyViaMail.test.js`) verifies that the entire process from signup to API key retrieval functions seamlessly.

## Project Structure

The project consists of automated tests written using Playwright and supporting libraries.

### Tests and Corresponding Steps

#### Part 1: Automate Signup Process

- **Test:** `signup.test.js`

  Automates navigating to the AEMET API portal and completing the signup process, including solving the reCAPTCHA.

- **Test:** `fetchApiKey.test.js`

  Retrieves the API key sent to the user's email and parses the email to extract the API key.

#### Part 2: Validate API Key and Data Retrieval

- **Test:** `requestAemetEndpoint.test.js`

  Uses the retrieved API key to make a request to the AEMET API endpoint and validates the response by:
  - Checking HTTP status codes.
  - Verifying the structure and content of the response data (fields like `temp`, `pres`, `vel`).
  - Ensuring that the datetime field respects the CET/CEST timezone.

### Additional Test

- **Test:** `retrieveApiKeyViaMail.test.js`

  Confirms and retrieves the API key from the email.

## Libraries Used

The project utilizes the following libraries to facilitate automation and testing:

- **Playwright**: A Node.js library to automate Chromium, Firefox, and WebKit with a single API.
- **playwright-recaptcha-solver**: A library that helps solve reCAPTCHA challenges without human intervention.
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **Imap**: A library for interacting with IMAP servers to retrieve emails.
- **axios**: A promise-based HTTP client for making API requests.
- **@playwright/test**: Provides testing capabilities integrated with Playwright.

## Requirements

- Node.js and npm installed.
- An email account for receiving the API key.
- Environment variables set in a `.env` file.

## Setup and Installation

**Clone the repository**
   ```bash
   git clone https://github.com/cparejaruiz/aemet-api-testing.git
   cd your-repository
   ```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```plaintext
USER_EMAIL=your-email@example.com
USER_PASS=your-email-password
AEMET_API_URL=https://opendata.aemet.es
```

## Run the Tests

To run all tests:

```bash
npx playwright test
```

To run a specific test:

```bash
npx playwright test tests/<test-file-name>.test.js
```

## Best Practices

- **Error Handling**: Ensure proper exception handling in your tests to facilitate debugging.
- **Security**: Never share sensitive credentials. Use the `.gitignore` file to prevent files like `.env`, `token.json`, and `credentials.json` from being versioned.
- **Consistent Use of ES Modules**: Maintain consistency in the use of ES modules throughout the project to avoid import/export conflicts.

## Next Steps

The next step is to implement Cucumber based on the test cases written in Gherkin syntax. This will allow for behavior-driven development (BDD) by connecting the Gherkin scenarios defined in `auto-test.feature` with executable test code.
