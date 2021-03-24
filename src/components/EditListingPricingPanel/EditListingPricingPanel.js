import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
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
    acc[currKey] = currVal

    return acc
  }, {})
}

const formatInitialValues = (prices, pricingOptionsForThisServiceType) => {
  return !prices ? generatePrices(pricingOptionsForThisServiceType) : formatPrices(prices)
}

const EditListingPricingPanel = ({
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
}) => {
  const classes = classNames(rootClassName || css.root, className)
  const currentListing = ensureOwnListing(listing)
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingPricingPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingPricingPanel.createListingTitle" />
  )
  const {
    title,
    publicData: { prices },
  } = currentListing.attributes
  const pricingOptionsForThisServiceType = pricingOptions[title] || []

  const [initialValues] = useState(formatInitialValues(prices, pricingOptionsForThisServiceType))

  const form = (
    <EditListingPricingForm
      title={title}
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
            const price =
              priceAsMoney && priceAsMoney.amount
                ? {
                    amount: priceAsMoney.amount,
                    currency: priceAsMoney.currency,
                  }
                : null

            if (!v[key].shouldContactForPrice) {
              if (!v[key].price || v[key].price.amount <= 0) {
                delete v[key]
                continue
              }
            }

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
      <p style={{ fontSize: 14, color: 'red', marginTop: 0 }}>
        <em>Leave price empty if service is not offered.</em>
      </p>

      <p style={{ fontSize: 14, marginTop: 0 }}>
        Please note that Nashville For Hire charges a 5% commission + a third-party 2.9% Stripe
        processing fee. These fees will be deducted from your sale before payout.
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
