import React, { Component } from 'react'
import { bool, func, shape, string, object } from 'prop-types'
import { injectIntl } from '../../util/reactIntl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { propTypes } from '../../util/types'
import { ensureUser, userDisplayNameAsString } from '../../util/data'
import {
  Page,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components'
import { TopbarContainer } from '../index'
import { initializeCardPaymentData } from '../../ducks/stripe.duck'
import { setInitialValues, beginNegotiation } from './BeginNegotiationPage.duck'
import { BeginNegotiation } from '../../components/NFHCustom/pages/BeginNegotiation'
import { Money } from 'sharetribe-flex-sdk/src/types'

const createCustomPricingParams = (params) => {
  const { listing, bookingData } = params

  const lineItems = Object.values(bookingData).map((d) => {
    // TODO: Handle when there is no price correctly
    const unitPrice = d.price ? new Money(d.price.amount, d.price.currency) : new Money(0, 'USD')

    return {
      code: 'line-item/' + d.code,
      unitPrice,
      quantity: d.quantity,
    }
  })

  return {
    listingId: listing.id,
    lineItems,
  }
}

export class NegotiationPageComponent extends Component {
  constructor(props) {
    super(props)

    this.handleBeginNegotiation = this.handleBeginNegotiation.bind(this)
  }

  handleBeginNegotiation() {
    const { callBeginNegotiation, bookingData, listing, transaction } = this.props
    const transactionId = transaction ? transaction.id : null

    const data = {
      transactionId,
      ...createCustomPricingParams({ listing, bookingData }),
    }

    callBeginNegotiation(beginNegotiation, data)
  }

  render() {
    const { listing, bookingData } = this.props

    // TODO: Probably redirect to listing if Redux doesn't have needed data
    if (!listing || !bookingData) return <div>Data is missing</div>

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
            <BeginNegotiation onBeginNegotiation={this.handleBeginNegotiation} />
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
  callBeginNegotiation: func.isRequired,
  onInitializeCardPaymentData: func.isRequired,
}

const mapStateToProps = (state) => {
  const { isAuthenticated } = state.Auth
  const { currentUser } = state.user
  const { listing, bookingData, transaction = null } = state.BeginNegotiationPage

  return {
    isAuthenticated,
    currentUser,
    listing,
    bookingData,
    transaction,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onBeginNegotiation: (params) => dispatch(beginNegotiation(params)),
  callSetInitialValues: (setInitialValues, values) => dispatch(setInitialValues(values)),
  callBeginNegotiation: (beginNegotiation, values) => dispatch(beginNegotiation(values)),
  onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
})

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const BeginNegotiationPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(NegotiationPageComponent)

BeginNegotiationPage.setInitialValues = (initialValues) => setInitialValues(initialValues)
BeginNegotiationPage.displayName = 'BeginNegotiationPage'

export default BeginNegotiationPage
