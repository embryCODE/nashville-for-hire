import { homepage, login } from '../helpers'

describe('Create new seller', () => {
  it('should visit the seller creation page', function () {
    cy.server()
    cy.route('POST', '**/api/own_listings/update').as('updateListing')
    cy.route('**/api/current_user/show*').as('currentUser')
    cy.route('**/api/own_listings/**/*').as('ownListings')

    login()

    // Home
    cy.contains('Become a seller').click()

    // Service Type
    cy.contains('What service are you selling?')
    cy.get('#title').type('Test service listing')
    cy.get('#serviceType').select('Keys')
    cy.get('[data-test="Next: Pricing-button"]').click()

    // Pricing
    cy.contains('What price do you want your services listed at?')
    cy.get('[data-test=option0-input]').clear().type('100')
    cy.get('[data-test="Next: About You-button"]').click()

    // About You
    cy.wait('@updateListing')
    cy.contains('Tell us about yourself')
    cy.wait(1000)
    cy.get('#whyAreYouTheRightFit').type('Because I am awesome')
    cy.get('#primaryGenres').type('Polka')
    cy.get('#experience').type('That guy from Home Alone')
    cy.get('[data-test="Next: About This Service-button"]').click()

    // About This Service
    cy.wait('@updateListing')
    cy.contains('About This Service')
    cy.wait(1000)
    cy.get('#averageTurnaroundTime').type('5 minutes')
    cy.get('#explainMore').type('Just trust me, I am great')
    cy.get('[data-test="Next: Photos-button"]').click()

    // Photos
    cy.wait('@updateListing')
    cy.contains('Upload Your High Quality Photos')
    cy.wait(1000)

    // SOMEDAY: Figure out ingenious way to upload photos with Cypress and Final Form
  })
})
