import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from '../../util/reactIntl'
import { LISTING_STATE_DRAFT } from '../../util/types'
import { ListingLink } from '../../components'
import { EditListingPricingForm } from '../../forms'
import { ensureOwnListing } from '../../util/data'
import { types as sdkTypes } from '../../util/sdkLoader'
import pricingOptions from '../../util/pricingOptions'

import css from './EditListingPricingPanel.css'

const { Money } = sdkTypes

const formatPrices = (prices) => {
  return Object.entries(prices).reduce((acc, [currKey, currVal]) => {
    acc[currKey] = {
      ...currVal,
      price: currVal.price ? new Money(currVal.price.amount, currVal.price.currency) : '',
    }
    return acc
  }, {})
}

const generatePrices = (pricingOptions) => {
  return Object.entries(pricingOptions).reduce((acc, [currKey, currVal]) => {
    acc[currKey] = {
      ...currVal,
      price: '',
      shouldContactForPrice: false,
    }
    return acc
  }, {})
}

/** Checks if price options don't match price options for this service type. */
const checkIsServiceTypeMismatched = (prices = {}, pricingOptionsForThisServiceType) => {
  return !Object.entries(prices).every(
    ([key, value]) => pricingOptionsForThisServiceType[key].code === value.code,
  )
}

const formatInitialValues = (prices, pricingOptionsForThisServiceType) => {
  const isServiceTypeMismatched = checkIsServiceTypeMismatched(
    prices,
    pricingOptionsForThisServiceType,
  )

  return !prices || isServiceTypeMismatched
    ? generatePrices(pricingOptionsForThisServiceType)
    : formatPrices(prices)
}

const EditListingPricingPanel = (props) => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props

  const classes = classNames(rootClassName || css.root, className)
  const currentListing = ensureOwnListing(listing)

  const {
    publicData: { serviceType, prices },
  } = currentListing.attributes
  const pricingOptionsForThisServiceType = pricingOptions[serviceType] || []
  const initialValues = formatInitialValues(prices, pricingOptionsForThisServiceType)

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingPricingPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingPricingPanel.createListingTitle" />
  )

  const form = (
    <EditListingPricingForm
      serviceType={serviceType}
      className={css.form}
      initialValues={initialValues}
      onSubmit={(values) => {
        const v = { ...values }

        // eslint bug
        // eslint-disable-next-line
        for (let key in v) {
          if (v.hasOwnProperty(key)) {
            const thisItem = v[key]
            const priceAsMoney = v[key].price

            // Price will be null if amount is 0, otherwise it will be this currency object
            const price = priceAsMoney.amount
              ? {
                  amount: priceAsMoney.amount,
                  currency: priceAsMoney.currency,
                }
              : null

            v[key] = {
              ...thisItem,
              price,
            }
          }
        }

        const updateValue = {
          publicData: {
            prices: v,
          },
        }

        onSubmit(updateValue)
      }}
      onChange={onChange}
      saveActionMsg={submitButtonText}
      disabled={disabled}
      ready={ready}
      updated={panelUpdated}
      updateInProgress={updateInProgress}
      fetchErrors={errors}
    />
  )

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <p style={{ fontSize: 14 }}>
        <em>
          Leave price empty if service is not offered. If you have additional prices, you can add
          them in the “About This Service” section by requesting a custom order from the buyer.
        </em>
      </p>
      {form}
    </div>
  )
}

const { func, object, string, bool } = PropTypes

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
}

EditListingPricingPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
}

export default EditListingPricingPanel
