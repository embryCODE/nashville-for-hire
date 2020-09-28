import { homepage, login } from '../helpers'

describe('Happy paths', () => {
  it('should render the home page', function () {
    homepage()
  })

  it('should login', () => {
    login()
  })
})

describe.only('Create new seller', () => {
  it('should visit the seller creation page', function () {
    cy.server()
    cy.route('POST','**/api/own_listings/update').as('updateListing')

    login()

    // Home
    cy.contains('Become a seller').click()

    // Service Type
    cy.contains('What service are you selling?')
    cy.get('#title').type('Test service listing')
    cy.get('#category').select('Keys')
    cy.get('.EditListingServiceTypeForm_root__kMd1d > .Button_root__3ZSaD').click()

    // Pricing
    cy.contains('What price do you want your services listed at?')
    cy.get('#price_option_0').type('1')
    cy.get('#price_option_1').type('3')
    cy.contains('Next: About You').click()

    // About You
    cy.wait('@updateListing')
    cy.contains('Tell us about yourself')
    cy.get('#whyAreYouTheRightFit').type('Because I am awesome')
    cy.get('#primaryGenres').type('Polka')
    cy.get('#experience').type('That guy from Home Alone')
    cy.contains('Next: About This Service').click()

    // About This Service
    cy.wait('@updateListing')
    cy.contains('About This Service')
    cy.get('#averageTurnaroundTime').type('5 minutes')
    cy.get('#explainMore').type('Just trust me, I am great')
    cy.contains('Next: Photos').click()

    // Photos
    cy.wait('@updateListing')
    cy.contains('Upload Your High Quality Photos')

    // TODO: Figure out ingenious way to upload photos with Cypress and Final Form
  })
})
