const { calculateQuantityFromDates, calculateTotalFromLineItems } = require('./lineItemHelpers')

const unitType = 'line-item/night'
const PROVIDER_COMMISSION_PERCENTAGE = -10

/** Returns collection of lineItems (max 50)
 *
 * Each line items has following fields:
 * - `code`: string, mandatory, indentifies line item type (e.g. \"line-item/cleaning-fee\"), maximum length 64 characters.
 * - `unitPrice`: money, mandatory
 * - `lineTotal`: money
 * - `quantity`: number
 * - `percentage`: number (e.g. 15.5 for 15.5%)
 * - `seats`: number
 * - `units`: number
 * - `includeFor`: array containing strings \"customer\" or \"provider\", default [\":customer\"  \":provider\" ]
 *
 * Line item must have either `quantity` or `percentage` or both `seats` and `units`.
 *
 * `includeFor` defines commissions. Customer commission is added by defining `includeFor` array `["customer"]` and provider commission by `["provider"]`.
 *
 * @param {Object} listing
 * @param {Object} bookingData
 * @returns {Array} lineItems
 */

const resolveDynamicPriceOptions = (listing) => {
  const publicData = listing.attributes.publicData

  const customFees = []

  for (const prop in publicData) {
    if (prop.match(/price_option/g)) {
      const priceOption = publicData[prop]
      console.log(priceOption)
      if (priceOption.amount && priceOption.currency) {
        customFees.push(new Money(priceOption.amount, priceOption.currency))
      }
    }
  }

  if (customFees.length > 0) {
    console.log('sending custom fees')
    return customFees
  }

  return null
}

exports.transactionLineItems = (listing, bookingData) => {
  const unitPrice = listing.attributes.price
  const { startDate, endDate } = bookingData

  const booking = {
    code: 'line-item/nights',
    unitPrice,
    quantity: calculateQuantityFromDates(startDate, endDate, unitType),
    includeFor: ['customer', 'provider'],
  }

  console.log(listing)

  const customFeesPrice = resolveDynamicPriceOptions(listing) // [Money, Money, Money, Money, Money ]
  const customFees = customFeesPrice
    ? customFeesPrice.map((customFee) => {
        return {
          code: `line-item/price_option_${index}`,
          unitPrice: customFee, // { amount: 900, currency: 'USD' }
          quantity: 1,
          includeFor: ['customer', 'provider'],
        }
      })
    : []

  const providerCommission = {
    code: 'line-item/provider-commission',
    unitPrice: calculateTotalFromLineItems([booking, ...customFees]),
    percentage: PROVIDER_COMMISSION_PERCENTAGE,
    includeFor: ['provider'],
  }

  const lineItems = [booking, ...customFees, providerCommission]

  return lineItems
}
