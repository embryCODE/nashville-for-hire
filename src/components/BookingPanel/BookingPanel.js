import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { intlShape, injectIntl } from '../../util/reactIntl'
import { func, oneOfType, shape, string } from 'prop-types'
import { propTypes } from '../../util/types'
import { Booking } from '../NFHCustom/pages/Booking'

const BookingPanel = (props) => {
  const { listing, onSubmit } = props

  const sellerName = listing.attributes.title
  const prices = listing.attributes.publicData.prices

  return <Booking sellerName={sellerName} prices={prices} onSubmit={onSubmit} />
}

BookingPanel.propTypes = {
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  onSubmit: func.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
}

export default compose(withRouter, injectIntl)(BookingPanel)
