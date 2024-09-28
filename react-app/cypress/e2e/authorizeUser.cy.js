describe('authorize user', () => {
  it('login', () => {
    cy.visit('http://localhost:3000/')
    let loginEmailElement = cy.get('[data-testid="login-email"]')
    loginEmailElement.click()
    loginEmailElement.type('test@gmail.com')
    let loginPasswordElement = cy.get('[data-testid="login-password"]')
    loginPasswordElement.click()
    loginPasswordElement.type('12345678')
    let loginButtonElement = cy.contains('button', 'Log in')
    loginButtonElement.click()
  })
})