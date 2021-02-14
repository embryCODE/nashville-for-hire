import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { intlShape, injectIntl } from '../../util/reactIntl'
import { func, oneOfType, shape, string, bool } from 'prop-types'
import { propTypes } from '../../util/types'
import { Booking } from '../NFHCustom/pages/Booking'

const BookingPanel = (props) => {
  const { listing, onSubmit, isDisabled } = props

  const sellerName = listing.author.attributes.profile.displayName
  const publicData = listing.attributes.publicData

  if (!publicData) return null

  const prices = publicData.prices

  return (
    <Booking isDisabled={isDisabled} sellerName={sellerName} prices={prices} onSubmit={onSubmit} />
  )
}

BookingPanel.propTypes = {
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  onSubmit: func.isRequired,
  isDisabled: bool,

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
