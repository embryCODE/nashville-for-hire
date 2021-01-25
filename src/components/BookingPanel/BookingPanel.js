import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { intlShape, injectIntl } from '../../util/reactIntl'
import { arrayOf, bool, func, node, oneOfType, shape, string } from 'prop-types'
import { propTypes } from '../../util/types'
import config from '../../config'

import { Booking } from '../NFHCustom/pages/Booking'

const BookingPanel = (props) => {
  const {
    rootClassName,
    className,
    titleClassName,
    listing,
    isOwnListing,
    onSubmit,
    title,
    subTitle,
    authorDisplayName,
    onManageDisableScrolling,
    timeSlots,
    fetchTimeSlotsError,
    history,
    location,
    intl,
  } = props

  const sellerName = listing.attributes.title
  const prices = listing.attributes.publicData.prices

  return <Booking sellerName={sellerName} prices={prices} />
}

BookingPanel.defaultProps = {
  rootClassName: null,
  className: null,
  titleClassName: null,
  isOwnListing: false,
  subTitle: null,
  unitType: config.bookingUnitType,
  timeSlots: null,
  fetchTimeSlotsError: null,
}

BookingPanel.propTypes = {
  rootClassName: string,
  className: string,
  titleClassName: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  isOwnListing: bool,
  unitType: propTypes.bookingUnitType,
  onSubmit: func.isRequired,
  title: oneOfType([node, string]).isRequired,
  subTitle: oneOfType([node, string]),
  authorDisplayName: oneOfType([node, string]).isRequired,
  onManageDisableScrolling: func.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,

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
