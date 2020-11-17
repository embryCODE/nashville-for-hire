import React, { useEffect, useState } from 'react'
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
import pricingOptions from '../../util/pricingOptions'

const { Money } = sdkTypes

export const EditListingPricingFormComponent = (props) => {
  const { serviceType, onSubmit, initialValues } = props
  // Hooks must be called here as you cannot use callbacks within a render method
  const [hidePriceInput, setHidePriceInput] = useState([])
  const [priceErrors, setPriceErrors] = useState([])
  const [form, setForm] = useState({})
  const [canShowError, setCanShowError] = useState(false)
  const priceOptionFields = pricingOptions[serviceType]

  const isValid =
    priceOptionFields.length > 0 && // ensure we have options
    priceErrors.length > 0 && // ensure that we have some errors (it's ok to have a few, all is bad)
    priceErrors.length !== priceOptionFields.length

  useEffect(() => {
    if (isValid) {
      // must modify the onSubmit to take values and updates values
      // to spoof the formRenderProps
      const values = {
        price: new Money(0, 'USD'),
        ...form,
      }
      return onSubmit(values)
    }
  }, [priceErrors, form, isValid, onSubmit])

  useEffect(() => {
    // eslint bug
    // eslint-disable-next-line
    for (const prop in initialValues) {
      if (initialValues.hasOwnProperty(prop) && prop.includes('contact')) {
        if (initialValues[prop] && initialValues[prop].checked) {
          setHidePriceInput([...hidePriceInput, prop.replace('_contact', '')])
        }
      }
    }
  }, [hidePriceInput, initialValues])

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

        const bypassSubmit = (e) => {
          setCanShowError(true)
          e.preventDefault()
          e.persist()
          // make a list of id's that should hold prices
          const priceOptions = priceOptionFields.map((val, index) => `price_option_${index}`)
          const priceOptionContacts = priceOptionFields.map(
            (val, index) => `price_option_${index}_contact`,
          )
          const combinedOptions = [...priceOptions, ...priceOptionContacts]

          const priceOptionValues = {} // build a basic object that holds the data I need

          for (let count = 0; count < combinedOptions.length; count++) {
            const { value, checked } = e.target[count]
            // when checking checkbox, the priceOption input is not passed to form
            // so when we submit successfully, the key is empty string with a valid object
            // here we are setting it no matter what
            const id = (e.target[count] && e.target[count].id) || `price_option_${count}`
            if (id.includes(`contact`)) {
              priceOptionValues[id] = { checked }
            } else {
              priceOptionValues[id] = new Money(value, 'USD')
            }
          }

          // will hold the optionId_contact for any optionId that has a price of zero
          // this is ok to have a few, all is bad
          // we will say is the error list length === price options length
          const errorsOn = []

          // eslint bug
          // eslint-disable-next-line
          for (const prop in priceOptionValues) {
            const price =
              !prop.includes(`_contact`) &&
              parseInt(priceOptionValues[prop].amount.replace(/[$.]/g, ''))
            const checked = prop.includes(`_contact`) ? priceOptionValues[prop].checked : true
            if (!price) {
              if (!checked) {
                errorsOn.push(prop)
              }
            }
          }

          setForm(priceOptionValues)
          setPriceErrors(errorsOn) // capture the list in state to spit errors
        }

        return (
          <Form
            onSubmit={(e) => {
              bypassSubmit(e)
            }}
            className={classes}
          >
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
            {!isValid && canShowError ? (
              <p className={css.error}>
                <FormattedMessage id="EditListingPricingForm.updateFailedDueToInvalidPricing" />
              </p>
            ) : null}
            {priceOptionFields &&
              priceOptionFields.map(({ label, placeholder }, index) => {
                const inputId = `price_option_${index}`
                return (
                  <>
                    {!hidePriceInput.some((input) => input === inputId) ? (
                      <FieldCurrencyInput
                        key={label}
                        id={inputId}
                        name={inputId}
                        className={css.priceInput}
                        autoFocus
                        label={label}
                        placeholder={placeholder}
                        currencyConfig={config.currencyConfig}
                        validate={(thing) => {
                          return priceValidators(thing)
                          // if (priceErrors.some(id => `${id}_contact` === inputId)) {
                          //   return 'false'
                          // }
                        }}
                      />
                    ) : (
                      <label key={`${inputId}_contact_key`} htmlFor={`${inputId}_contact`}>
                        {label}
                      </label>
                    )}
                    <FieldCheckbox
                      key={`${inputId}_contact_checkbox_key`}
                      id={`${inputId}_contact`}
                      name={`${inputId}_contact`}
                      label={'Contact for pricing'}
                      value={'contact'}
                      onClick={(val) => {
                        val.persist()
                        const isChecked = val.target.checked
                        if (isChecked) {
                          // add to list
                          setHidePriceInput([...hidePriceInput, inputId])
                        } else {
                          setHidePriceInput(hidePriceInput.filter((input) => input !== inputId))
                        }
                      }}
                    />
                  </>
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
