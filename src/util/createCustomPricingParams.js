import { Money } from 'sharetribe-flex-sdk/src/types'

export default function ({ listing, bookingData }) {
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
