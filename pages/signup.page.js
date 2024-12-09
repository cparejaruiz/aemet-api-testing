export class SignupPage {
  constructor(page) {
      //Selectors
      this.page = page;
      this.emailInput = page.locator('#email');
      this.submitButton = page.getByRole('button', { name: 'Enviar' });
      this.confirmationMessage = page.getByText('Su petición ha sido enviada,');

    }

    async enterEmail(email) {
      await this.emailInput.fill(email)
    }

    async submitForm() {
      await this.submitButton.click()
    }

  }
