import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/signup.page';
import { solveCaptcha } from 'playwright-recaptcha-solver';
import dotenv from 'dotenv';

//Automate navigating to the AEMET API portal and completing the signup process.
//    o Be aware of a reCAPTCHA


// playwright-recaptcha-solver is a libary that helps to solve the reCAPTCHA withou human intervention 


//dotenv is used to read the .env file
dotenv.config();

test.describe('Signup Page Tests', () => {
        let ctx ;
        let page ;

    let signupPage;

    test.beforeAll(async ({ browser }) => {
        ctx = await browser.newContext();
        page = await browser.newPage();

        signupPage = new SignupPage(page);
        await page.goto('https://opendata.aemet.es/centrodedescargas/obtencionAPIKey');
    });

    test.afterAll(async () => {
        await page.close();
    });


    test('should submit the form', async () => {
        const userEmail = process.env.USER_EMAIL;
        await signupPage.enterEmail(userEmail);
        await solveCaptcha(page);
        await signupPage.submitForm();
        await expect(signupPage.confirmationMessage).toBeVisible();
    });
});