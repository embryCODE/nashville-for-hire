/**
 * Booking breakdown estimation
 *
 * Transactions have payment information that can be shown with the
 * BookingBreakdown component. However, when selecting booking
 * details, there is no transaction object present and we have to
 * estimate the breakdown of the transaction without data from the
 * API.
 *
 * If the payment process of a customized marketplace is something
 * else than simply daily or nightly bookings, the estimation will
 * most likely need some changes.
 *
 * To customize the estimation, first change the BookingDatesForm to
 * collect all booking information from the user (in addition to the
 * default date pickers), and provide that data to the
 * EstimatedBreakdownMaybe components. You can then make customization
 * within this file to create a fake transaction object that
 * calculates the breakdown information correctly according to the
 * process.
 *
 * In the future, the optimal scenario would be to use the same
 * transactions.initiateSpeculative API endpoint as the CheckoutPage
 * is using to get the breakdown information from the API, but
 * currently the API doesn't support that for logged out users, and we
 * are forced to estimate the information here.
 */
import React from 'react'
import Decimal from 'decimal.js'
import { types as sdkTypes } from '../../util/sdkLoader'
import { TRANSITION_REQUEST_PAYMENT, TX_TRANSITION_ACTOR_CUSTOMER } from '../../util/transaction'
import { LINE_ITEM_UNITS, DATE_TYPE_DATE } from '../../util/types'
import { BookingBreakdown } from '../../components'
import css from './BookingDatesForm.css'

const { Money, UUID } = sdkTypes

const buildTotalPrice = (lineItems) => {
  // Only supporting this for now
  const currency = 'USD'

  const totalNumericPrice = lineItems.reduce((acc, curr) => {
    const currPriceAsNumber = curr.lineTotal.amount
    return acc + currPriceAsNumber
  }, 0)

  return new Money(totalNumericPrice, currency)
}

const buildLineItems = (prices) => {
  // Only supporting this for now
  const currency = 'USD'

  // TODO: Not sure how to handle shouldContactForPrice
  //  Setting to 0 for now

  // TODO: Do I need LINE_ITEM_CONTACT_FOR_MUSIC_SERVICE_PRICE or LINE_ITEM_MUSIC_SERVICE_PRICE?
  return Object.values(prices).map((p) => {
    return {
      code: LINE_ITEM_UNITS,
      includeFor: ['customer', 'provider'],
      unitPrice: new Money(p.shouldContactForPrice ? 0 : p.price.amount, currency),
      quantity: new Decimal(1),
      lineTotal: new Money(p.shouldContactForPrice ? 0 : p.price.amount, currency),
      reversal: false,
    }
  })
}

const estimatedTransaction = (prices) => {
  const now = new Date()
  const lineItems = buildLineItems(prices)
  const totalPrice = buildTotalPrice(lineItems)

  return {
    id: new UUID('estimated-transaction'),
    type: 'transaction',
    attributes: {
      createdAt: now,
      lastTransitionedAt: now,
      lastTransition: TRANSITION_REQUEST_PAYMENT,
      payinTotal: totalPrice,
      payoutTotal: totalPrice,
      lineItems,
      transitions: [
        {
          createdAt: now,
          by: TX_TRANSITION_ACTOR_CUSTOMER,
          transition: TRANSITION_REQUEST_PAYMENT,
        },
      ],
    },
    booking: {
      id: new UUID('estimated-booking'),
      type: 'booking',
      attributes: {},
    },
  }
}

const EstimatedBreakdownMaybe = (props) => {
  const { prices } = props.bookingData
  const publicData = props.publicData

  const canEstimatePrice = true // TODO
  if (!canEstimatePrice) {
    return null
  }

  const tx = estimatedTransaction(prices)

  return (
    <BookingBreakdown
      className={css.receipt}
      userRole="customer"
      unitType={LINE_ITEM_UNITS}
      transaction={tx}
      booking={tx.booking}
      dateType={DATE_TYPE_DATE}
      publicData={publicData}
    />
  )
}

export default EstimatedBreakdownMaybe
