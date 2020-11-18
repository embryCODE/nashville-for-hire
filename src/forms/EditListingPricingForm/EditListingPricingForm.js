import React, { Fragment } from 'react'
import { bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl'
import classNames from 'classnames'
import config from '../../config'
import { propTypes } from '../../util/types'
import * as validators from '../../util/validators'
import { formatMoney } from '../../util/currency'
import { types as sdkTypes } from '../../util/sdkLoader'
import { Button, Form, FieldCurrencyInput, FieldCheckbox } from '../../components'
import css from './EditListingPricingForm.css'

const { Money } = sdkTypes

export const EditListingPricingFormComponent = (props) => {
  return (
    <FinalForm
      {...props}
      render={(formRenderProps) => {
        const {
          className,
          disabled,
          ready,
          intl,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
          initialValues,
          handleSubmit,
        } = formRenderProps

        const priceRequired = validators.required(
          intl.formatMessage({
            id: 'EditListingPricingForm.priceRequired',
          }),
        )

        const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency)

        const minPriceRequired = validators.moneySubUnitAmountAtLeast(
          intl.formatMessage(
            {
              id: 'EditListingPricingForm.priceTooLow',
            },
            {
              minPrice: formatMoney(intl, minPrice),
            },
          ),
          config.listingMinimumPriceSubUnits,
        )

        const priceValidators = config.listingMinimumPriceSubUnits
          ? validators.composeValidators(priceRequired, minPriceRequired)
          : priceRequired

        const classes = classNames(css.root, className)
        const submitReady = (updated && pristine) || ready
        const submitInProgress = updateInProgress
        const submitDisabled = invalid || disabled || submitInProgress
        const { updateListingError, showListingsError } = fetchErrors || {}

        return (
          <Form onSubmit={handleSubmit} className={classes}>
            {updateListingError ? (
              <p className={css.error}>
                <FormattedMessage id="EditListingPricingForm.updateFailed" />
              </p>
            ) : null}

            {showListingsError ? (
              <p className={css.error}>
                <FormattedMessage id="EditListingPricingForm.showListingFailed" />
              </p>
            ) : null}

            {Object.entries(initialValues).map(([priceKey, priceValue]) => {
              const { label, placeholder } = priceValue

              return (
                <Fragment key={priceKey}>
                  <FieldCurrencyInput
                    id={label}
                    name={`${priceKey}.price`}
                    className={css.priceInput}
                    autoFocus
                    label={label}
                    placeholder={placeholder}
                    currencyConfig={config.currencyConfig}
                    validate={(thing) => {
                      return priceValidators(thing)
                    }}
                  />

                  <FieldCheckbox
                    id={`${label}-shouldContactForPrice`}
                    name={`${priceKey}.shouldContactForPrice`}
                    label="Contact for pricing"
                    format={Boolean}
                    parse={Boolean}
                  />
                </Fragment>
              )
            })}

            <Button
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              ready={submitReady}
            >
              {saveActionMsg}
            </Button>
          </Form>
        )
      }}
    />
  )
}
EditListingPricingFormComponent.defaultProps = { fetchErrors: null }

EditListingPricingFormComponent.propTypes = {
  serviceType: string.isRequired,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
}

export default compose(injectIntl)(EditListingPricingFormComponent)
