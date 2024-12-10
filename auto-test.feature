Feature: AEMET API Testing

  Scenario: Signup and Submit Form
    Given I navigate to the AEMET API signup page
    When I enter my email and solve the captcha
    And I submit the signup form
    Then I should see a confirmation message

  Scenario: Retrieve API Key from Email
    Given I have access to the email account
    When I retrieve the API key from the email
    Then the API key should be valid

  Scenario: Fetch Data from AEMET API
    Given I have a valid API key
    When I make a request to an AEMET API endpoint
    Then I should receive a HTTP 200 response
    And the response should contain the expected data