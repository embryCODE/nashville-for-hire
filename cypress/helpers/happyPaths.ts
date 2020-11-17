export function homepage() {
  cy.visit('/')
  cy.contains(
    "Make your next recording project your best yet by hiring Nashville's top music professionals remotely.",
  )
  cy.get('.CookieConsent_continueBtn__Y00d9').click()
}

export function login() {
  cy.server()
  cy.route('**/api/current_user/show*').as('currentUser')

  cy.visit('/')
  cy.get('.TopbarDesktop_login__29amu > span').click()
  cy.get(
    ':nth-child(2) > .TabNavHorizontal_tabContent__sgVDv > .AuthenticationPage_tab__EgqeJ > span',
  ).click()
  cy.get('#email').type('test@embrycode.com')
  cy.get('#password').type('log_earn3KAI5pou{enter}')

  cy.wait('@currentUser')

  cy.get('.Avatar_root__1l69b > .Avatar_initials__3yl2s').contains('TT')
}
