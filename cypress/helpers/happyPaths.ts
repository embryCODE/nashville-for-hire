export function homepage() {
  cy.visit('/')
  cy.contains(
    "Make your next recording project your best yet by hiring Nashville's top music professionals remotely.",
  )
  cy.get('[data-test=cookieConsent]').click()
}

export function login() {
  cy.server()
  cy.route('**/api/current_user/show*').as('currentUser')

  cy.visit('/')
  cy.get('[data-test=login]').click()
  // cy.get('[data-test=emailInput]').click()
  cy.get('#email').type('test@embrycode.com')
  cy.get('#password').type('log_earn3KAI5pou{enter}')

  cy.wait('@currentUser')

  cy.get('[data-test=avatarInitials]').contains('TT')
}
