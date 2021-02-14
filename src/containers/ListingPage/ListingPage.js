/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react'
import { array, arrayOf, bool, func, shape, string, oneOf } from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import config from '../../config'
import routeConfiguration from '../../routeConfiguration'
import { LISTING_STATE_PENDING_APPROVAL, propTypes } from '../../util/types'
import { types as sdkTypes } from '../../util/sdkLoader'
import {
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_EDIT,
  createSlug,
} from '../../util/urlHelpers'
import { createResourceLocatorString } from '../../util/routes'
import {
  ensureListing,
  ensureOwnListing,
  ensureUser,
  userDisplayNameAsString,
} from '../../util/data'
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck'
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck'
import { initializeCardPaymentData } from '../../ducks/stripe.duck.js'
import {
  Page,
  NamedRedirect,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  BookingPanel,
} from '../../components'
import { TopbarContainer, NotFoundPage } from '../../containers'
import { sendEnquiry, loadData, setInitialValues } from './ListingPage.duck'
import SectionImages from './SectionImages'
import SectionAvatar from './SectionAvatar'
import SectionReviews from './SectionReviews'
import SectionHostMaybe from './SectionHostMaybe'
import css from './ListingPage.css'
import { Listing } from '../../components/NFHCustom/pages/Listing'
import { beginNegotiation } from '../../ducks/Negotiation.duck'
import createCustomPricingParams from '../../util/createCustomPricingParams'
import styled from 'styled-components'
import { Services } from '../../components/NFHCustom/pages/Services'
import { startCase } from 'lodash'

const { UUID } = sdkTypes

const AvatarWrapper = styled.div`
  position: relative;
  padding: 0 3rem;
`

const ContentWrapper = styled.div`
  width: 100%;
  padding: 0 2rem;
`

const Links = styled.div`
  margin-top: 1rem;
  text-align: right;
`

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
`

const LeftColumn = styled.div``

const MiddleColumn = styled.div`
  padding-top: 2rem;
`

const RightColumn = styled.div`
  padding-top: 2rem;
`

export class ListingPageComponent extends Component {
  constructor(props) {
    super(props)
    const { enquiryModalOpenForListingId, params } = props
    this.state = {
      pageClassNames: [],
      imageCarouselOpen: false,
      enquiryModalOpen: enquiryModalOpenForListingId === params.id,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onContactUser = this.onContactUser.bind(this)
    this.onSubmitEnquiry = this.onSubmitEnquiry.bind(this)
  }

  handleSubmit(bookingData) {
    const {
      history,
      getListing,
      params,
      onInitializeCardPaymentData,
      callBeginNegotiation,
      transaction,
    } = this.props

    // Clear previous Stripe errors from store if there is any
    onInitializeCardPaymentData()

    const routes = routeConfiguration()
    const listingId = new UUID(params.id)
    const listing = getListing(listingId)
    const transactionId = transaction ? transaction.id : null
    const data = {
      transactionId,
      ...createCustomPricingParams({ listing, bookingData }),
    }

    callBeginNegotiation(beginNegotiation, data)
      .then((txId) => {
        // Redirect to OrderDetailsPage
        history.push(createResourceLocatorString('OrderDetailsPage', routes, { id: txId.uuid }, {}))
      })
      .catch((err) => {
        if (err.status === 403) {
          history.push(createResourceLocatorString('LoginPage', routes, {}, {}))
          return
        }

        console.error(err)
      })
  }

  onContactUser() {
    const { currentUser, history, callSetInitialValues, params, location } = this.props

    if (!currentUser) {
      const state = { from: `${location.pathname}${location.search}${location.hash}` }

      // We need to log in before showing the modal, but first we need to ensure
      // that modal does open when user is redirected back to this listingpage
      callSetInitialValues(setInitialValues, { enquiryModalOpenForListingId: params.id })

      // signup and return back to listingPage.
      history.push(createResourceLocatorString('SignupPage', routeConfiguration(), {}, {}), state)
    } else {
      this.setState({ enquiryModalOpen: true })
    }
  }

  onSubmitEnquiry(values) {
    const { history, params, onSendEnquiry } = this.props
    const routes = routeConfiguration()
    const listingId = new UUID(params.id)
    const { message } = values

    onSendEnquiry(listingId, message.trim())
      .then((txId) => {
        this.setState({ enquiryModalOpen: false })

        // Redirect to OrderDetailsPage
        history.push(createResourceLocatorString('OrderDetailsPage', routes, { id: txId.uuid }, {}))
      })
      .catch(() => {
        // Ignore, error handling in duck file
      })
  }

  render() {
    const {
      isAuthenticated,
      currentUser,
      getListing,
      getOwnListing,
      intl,
      onManageDisableScrolling,
      params: rawParams,
      location,
      scrollingDisabled,
      showListingError,
      reviews,
      fetchReviewsError,
      sendEnquiryInProgress,
      sendEnquiryError,
    } = this.props

    const listingId = new UUID(rawParams.id)
    const isPendingApprovalVariant = rawParams.variant === LISTING_PAGE_PENDING_APPROVAL_VARIANT
    const isDraftVariant = rawParams.variant === LISTING_PAGE_DRAFT_VARIANT
    const currentListing =
      isPendingApprovalVariant || isDraftVariant
        ? ensureOwnListing(getOwnListing(listingId))
        : ensureListing(getListing(listingId))

    const listingSlug = rawParams.slug || createSlug(currentListing.attributes.title || '')
    const params = { slug: listingSlug, ...rawParams }

    const listingType = isDraftVariant
      ? LISTING_PAGE_PARAM_TYPE_DRAFT
      : LISTING_PAGE_PARAM_TYPE_EDIT
    const listingTab = isDraftVariant ? 'photos' : 'serviceType'

    const isApproved =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_PENDING_APPROVAL

    const pendingIsApproved = isPendingApprovalVariant && isApproved

    // If a /pending-approval URL is shared, the UI requires
    // authentication and attempts to fetch the listing from own
    // listings. This will fail with 403 Forbidden if the author is
    // another user. We use this information to try to fetch the
    // public listing.
    const pendingOtherUsersListing =
      (isPendingApprovalVariant || isDraftVariant) &&
      showListingError &&
      showListingError.status === 403
    const shouldShowPublicListingPage = pendingIsApproved || pendingOtherUsersListing

    if (shouldShowPublicListingPage) {
      return <NamedRedirect name="ListingPage" params={params} search={location.search} />
    }

    const { description = '', title = '' } = currentListing.attributes

    const topbar = <TopbarContainer />

    if (showListingError && showListingError.status === 404) {
      // 404 listing not found

      return <NotFoundPage />
    } else if (showListingError) {
      // Other error in fetching listing

      const errorTitle = intl.formatMessage({
        id: 'ListingPage.errorLoadingListingTitle',
      })

      return (
        <Page title={errorTitle} scrollingDisabled={scrollingDisabled}>
          <LayoutSingleColumn className={css.pageRoot}>
            <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
            <LayoutWrapperMain>
              <p className={css.errorText}>
                <FormattedMessage id="ListingPage.errorLoadingListingMessage" />
              </p>
            </LayoutWrapperMain>
            <LayoutWrapperFooter>
              <Footer />
            </LayoutWrapperFooter>
          </LayoutSingleColumn>
        </Page>
      )
    } else if (!currentListing.id) {
      // Still loading the listing

      const loadingTitle = intl.formatMessage({
        id: 'ListingPage.loadingListingTitle',
      })

      return (
        <Page title={loadingTitle} scrollingDisabled={scrollingDisabled}>
          <LayoutSingleColumn className={css.pageRoot}>
            <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
            <LayoutWrapperMain>
              <p className={css.loadingText}>
                <FormattedMessage id="ListingPage.loadingListingMessage" />
              </p>
            </LayoutWrapperMain>
            <LayoutWrapperFooter>
              <Footer />
            </LayoutWrapperFooter>
          </LayoutSingleColumn>
        </Page>
      )
    }

    const handleViewPhotosClick = (e) => {
      // Stop event from bubbling up to prevent image click handler
      // trying to open the carousel as well.
      e.stopPropagation()
      this.setState({
        imageCarouselOpen: true,
      })
    }
    const authorAvailable = currentListing && currentListing.author
    const userAndListingAuthorAvailable = !!(currentUser && authorAvailable)
    const isOwnListing =
      userAndListingAuthorAvailable && currentListing.author.id.uuid === currentUser.id.uuid

    const currentAuthor = authorAvailable ? currentListing.author : null
    const ensuredAuthor = ensureUser(currentAuthor)

    // When user is banned or deleted the listing is also deleted.
    // Because listing can be never showed with banned or deleted user we don't have to provide
    // banned or deleted display names for the function
    const authorDisplayName = userDisplayNameAsString(ensuredAuthor, '')

    const handleBookingSubmit = (values) => {
      if (isOwnListing) {
        window.scrollTo(0, 0)
      } else {
        this.handleSubmit(values)
      }
    }

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

    const facebookImages = listingImages(currentListing, 'facebook')
    const twitterImages = listingImages(currentListing, 'twitter')
    const schemaImages = JSON.stringify(facebookImages.map((img) => img.url))
    const siteTitle = config.siteTitle
    const schemaTitle = intl.formatMessage(
      { id: 'ListingPage.schemaTitle' },
      {
        title: startCase(title),
        siteTitle,
      },
    )

    return (
      <Page
        title={schemaTitle}
        scrollingDisabled={scrollingDisabled}
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
        <LayoutSingleColumn className={css.pageRoot}>
          <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>

          <LayoutWrapperMain>
            <div>
              <SectionImages
                title={title}
                listing={currentListing}
                isOwnListing={isOwnListing}
                editParams={{
                  id: listingId.uuid,
                  slug: listingSlug,
                  type: listingType,
                  tab: listingTab,
                }}
                imageCarouselOpen={this.state.imageCarouselOpen}
                onImageCarouselClose={() => this.setState({ imageCarouselOpen: false })}
                handleViewPhotosClick={handleViewPhotosClick}
                onManageDisableScrolling={onManageDisableScrolling}
              />

              <AvatarWrapper>
                <SectionAvatar user={currentAuthor} params={params} />
              </AvatarWrapper>

              <ContentWrapper>
                <Links>
                  <SectionHostMaybe
                    title={title}
                    listing={currentListing}
                    authorDisplayName={authorDisplayName}
                    onContactUser={this.onContactUser}
                    isEnquiryModalOpen={isAuthenticated && this.state.enquiryModalOpen}
                    onCloseEnquiryModal={() => this.setState({ enquiryModalOpen: false })}
                    sendEnquiryError={sendEnquiryError}
                    sendEnquiryInProgress={sendEnquiryInProgress}
                    onSubmitEnquiry={this.onSubmitEnquiry}
                    currentUser={currentUser}
                    onManageDisableScrolling={onManageDisableScrolling}
                  />
                </Links>

                <Columns>
                  <LeftColumn>
                    <Listing
                      listingAttributes={currentListing.attributes}
                      sellerName={currentAuthor.attributes.profile.displayName}
                    />
                  </LeftColumn>

                  <MiddleColumn>
                    <Services listingAttributes={currentListing.attributes} />
                  </MiddleColumn>

                  <RightColumn>
                    <BookingPanel
                      isDisabled={!currentUser}
                      listing={currentListing}
                      onSubmit={handleBookingSubmit}
                    />
                  </RightColumn>
                </Columns>

                <SectionReviews reviews={reviews} fetchReviewsError={fetchReviewsError} />
              </ContentWrapper>
            </div>
          </LayoutWrapperMain>

          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    )
  }
}

ListingPageComponent.defaultProps = {
  unitType: config.bookingUnitType,
  currentUser: null,
  enquiryModalOpenForListingId: null,
  showListingError: null,
  reviews: [],
  fetchReviewsError: null,
  timeSlots: null,
  fetchTimeSlotsError: null,
  sendEnquiryError: null,
  filterConfig: config.custom.filters,
}

ListingPageComponent.propTypes = {
  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  unitType: propTypes.bookingUnitType, // from injectIntl
  intl: intlShape.isRequired,

  params: shape({
    id: string.isRequired,
    slug: string,
    variant: oneOf([LISTING_PAGE_DRAFT_VARIANT, LISTING_PAGE_PENDING_APPROVAL_VARIANT]),
  }).isRequired,

  isAuthenticated: bool.isRequired,
  currentUser: propTypes.currentUser,
  getListing: func.isRequired,
  getOwnListing: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  scrollingDisabled: bool.isRequired,
  enquiryModalOpenForListingId: string,
  showListingError: propTypes.error,
  callSetInitialValues: func.isRequired,
  reviews: arrayOf(propTypes.review),
  fetchReviewsError: propTypes.error,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,
  sendEnquiryInProgress: bool.isRequired,
  sendEnquiryError: propTypes.error,
  onSendEnquiry: func.isRequired,
  onInitializeCardPaymentData: func.isRequired,
  filterConfig: array,
}

const mapStateToProps = (state) => {
  const { isAuthenticated } = state.Auth
  const {
    showListingError,
    reviews,
    fetchReviewsError,
    timeSlots,
    fetchTimeSlotsError,
    sendEnquiryInProgress,
    sendEnquiryError,
    enquiryModalOpenForListingId,
  } = state.ListingPage
  const { currentUser } = state.user

  const getListing = (id) => {
    const ref = { id, type: 'listing' }
    const listings = getMarketplaceEntities(state, [ref])
    return listings.length === 1 ? listings[0] : null
  }

  const getOwnListing = (id) => {
    const ref = { id, type: 'ownListing' }
    const listings = getMarketplaceEntities(state, [ref])
    return listings.length === 1 ? listings[0] : null
  }

  return {
    isAuthenticated,
    currentUser,
    getListing,
    getOwnListing,
    scrollingDisabled: isScrollingDisabled(state),
    enquiryModalOpenForListingId,
    showListingError,
    reviews,
    fetchReviewsError,
    timeSlots,
    fetchTimeSlotsError,
    sendEnquiryInProgress,
    sendEnquiryError,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  callSetInitialValues: (setInitialValues, values) => dispatch(setInitialValues(values)),
  callBeginNegotiation: (beginNegotiation, values) => dispatch(beginNegotiation(values)),
  onSendEnquiry: (listingId, message) => dispatch(sendEnquiry(listingId, message)),
  onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
})

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const ListingPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(ListingPageComponent)

ListingPage.setInitialValues = (initialValues) => setInitialValues(initialValues)
ListingPage.loadData = loadData

export default ListingPage
