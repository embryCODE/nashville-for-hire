import React, { Component } from 'react'
import { bool, func, shape, string, object } from 'prop-types'
import { injectIntl } from '../../util/reactIntl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import routeConfiguration from '../../routeConfiguration'
import { propTypes } from '../../util/types'
import { createSlug } from '../../util/urlHelpers'
import { createResourceLocatorString, findRouteByRouteName } from '../../util/routes'
import { ensureUser, userDisplayNameAsString } from '../../util/data'
import {
  Page,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components'

import { setPrices } from './NegotiationPage.duck'
import { TopbarContainer } from '../index'
import { initializeCardPaymentData } from '../../ducks/stripe.duck'
import { setInitialValues } from './NegotiationPage.duck'

export class NegotiationPageComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pageData: {},
      dataLoaded: false,
      submitting: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    const {
      callSetInitialValues,
      onInitializeCardPaymentData,
      history,
      bookingData,
      listing,
    } = this.props

    const initialValues = {
      listing,
      bookingData,
      confirmPaymentError: null,
    }

    const routes = routeConfiguration()
    // Customize checkout page state with current listing and selected bookingDates
    const { setInitialValues } = findRouteByRouteName('CheckoutPage', routes)
    callSetInitialValues(setInitialValues, initialValues)

    // Clear previous Stripe errors from store if there is any
    onInitializeCardPaymentData()

    // Redirect to CheckoutPage
    history.push(
      createResourceLocatorString(
        'CheckoutPage',
        routes,
        {
          id: listing.id.uuid,
          slug: createSlug(listing.attributes.title),
        },
        {},
      ),
    )
  }

  render() {
    console.log('Negotiation page props:', this.props)
    const { listing } = this.props

    if (!listing) return null

    const { description = '' } = listing.attributes
    const authorAvailable = listing && listing.author
    const currentAuthor = authorAvailable ? listing.author : null
    const ensuredAuthor = ensureUser(currentAuthor)

    // When user is banned or deleted the listing is also deleted.
    // Because listing can be never showed with banned or deleted user we don't have to provide
    // banned or deleted display names for the function
    const authorDisplayName = userDisplayNameAsString(ensuredAuthor, '')

    const listingImages = (listing, variantName) =>
      (listing.images || [])
        .map((image) => {
          const variants = image.attributes.variants
          const variant = variants ? variants[variantName] : null

          // deprecated
          // for backwards combatility only
          const sizes = image.attributes.sizes
          const size = sizes ? sizes.find((i) => i.name === variantName) : null

          return variant || size
        })
        .filter((variant) => variant != null)

    const facebookImages = listingImages(listing, 'facebook')
    const twitterImages = listingImages(listing, 'twitter')
    const schemaImages = JSON.stringify(facebookImages.map((img) => img.url))
    const schemaTitle = 'Here is the schema title'

    return (
      <Page
        title={schemaTitle}
        scrollingDisabled={false}
        author={authorDisplayName}
        contentType="website"
        description={description}
        facebookImages={facebookImages}
        twitterImages={twitterImages}
        schema={{
          '@context': 'http://schema.org',
          '@type': 'ItemPage',
          description: description,
          name: schemaTitle,
          image: schemaImages,
        }}
      >
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain>
            <h1>Content goes here</h1>
            <form onSubmit={this.handleSubmit}>
              <button>To checkout</button>
            </form>
          </LayoutWrapperMain>

          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    )
  }
}

NegotiationPageComponent.defaultProps = {
  currentUser: null,
  listing: null,
  bookingData: {},
  transaction: null,
  setPricingError: null,
}

NegotiationPageComponent.propTypes = {
  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  isAuthenticated: bool.isRequired,
  currentUser: propTypes.currentUser,
  listing: propTypes.listing,
  bookingData: object,
  transaction: propTypes.transaction,
  setPricingError: propTypes.error,

  callSetInitialValues: func.isRequired,
  onInitializeCardPaymentData: func.isRequired,
}

const mapStateToProps = (state) => {
  const { isAuthenticated } = state.Auth
  const { listing, bookingData, transaction, setPricingError } = state.NegotiationPage
  const { currentUser } = state.user

  return {
    isAuthenticated,
    currentUser,
    listing,
    bookingData,
    transaction,
    setPricingError,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onSetPrices: (params) => dispatch(setPrices(params)),
  callSetInitialValues: (setInitialValues, values) => dispatch(setInitialValues(values)),
  onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
})

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const NegotiationPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(NegotiationPageComponent)

NegotiationPage.setInitialValues = (initialValues) => setInitialValues(initialValues)
NegotiationPage.displayName = 'NegotiationPage'

export default NegotiationPage
