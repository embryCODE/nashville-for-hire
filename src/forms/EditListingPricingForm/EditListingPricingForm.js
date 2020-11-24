import React, { Fragment } from 'react'
import { bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl'
import classNames from 'classnames'
import config from '../../config'
import { propTypes } from '../../util/types'
import { Button, Form, FieldCurrencyInput, FieldCheckbox } from '../../components'
import css from './EditListingPricingForm.css'

export const EditListingPricingFormComponent = (props) => {
  return (
    <FinalForm
      {...props}
      validate={(values) => {
        const errors = {}

        const isValid = Object.values(values).some((option) => {
          return (option.price && option.price.amount > 0) || option.shouldContactForPrice === true
        })

        if (!isValid) {
          errors.price = 'At least one price must be selected'
        }

        return errors
      }}
      render={(formRenderProps) => {
        const {
          className,
          disabled,
          ready,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
          initialValues,
          handleSubmit,
          values,
        } = formRenderProps

        const classes = classNames(css.root, className)
        const submitReady = (updated && pristine) || ready
        const submitDisabled = invalid || disabled || updateInProgress
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

            {Object.entries(initialValues).map(([priceKey, priceValue], index) => {
              const { label, placeholder } = priceValue

              return (
                <Fragment key={priceKey}>
                  {!values[priceKey].shouldContactForPrice && (
                    <FieldCurrencyInput
                      id={label}
                      name={`${priceKey}.price`}
                      className={css.priceInput}
                      autoFocus={index === 0}
                      label={label}
                      placeholder={placeholder}
                      currencyConfig={config.currencyConfig}
                      data-test={`${priceKey}-input`}
                    />
                  )}

                  {values[priceKey].shouldContactForPrice && (
                    <label
                      // Judge not, lest ye be judged
                      style={{
                        fontWeight: 600,
                        marginTop: 0,
                        marginBottom: 0,
                        paddingTop: 6,
                        paddingBottom: 2,
                      }}
                    >
                      {label}
                    </label>
                  )}

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
              inProgress={updateInProgress}
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
