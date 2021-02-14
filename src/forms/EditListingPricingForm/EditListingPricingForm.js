import React, { useState } from 'react'
import { bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl'
import classNames from 'classnames'
import config from '../../config'
import { propTypes } from '../../util/types'
import { Button, Form, FieldCurrencyInput, FieldCheckbox, FieldTextInput } from '../../components'
import { css } from 'styled-components/macro'

const getStartingCustomOptionNumber = (initialValues) => {
  const customCodes = Object.values(initialValues)
    .filter((option) => {
      return option.code.includes('custom')
    })
    .map((option) => {
      return parseInt(option.code.split('custom').slice(1))
    })

  return customCodes[customCodes.length - 1] + 1
}

export const EditListingPricingFormComponent = (props) => {
  const [numOfCustomOptions, setNumOfCustomOptions] = useState(0)
  const handleAddCustomOption = () => {
    setNumOfCustomOptions((prevState) => prevState + 1)
  }

  const customOptions = new Array(numOfCustomOptions).fill({}).map((co, i) => {
    return {
      code: `custom${i + getStartingCustomOptionNumber(props.initialValues)}`,
    }
  })

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

            {Object.entries(values).map(([priceKey, priceValue], index) => {
              const { title, description } = priceValue

              return (
                <div
                  key={priceKey}
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  `}
                >
                  <div
                    css={css`
                      min-width: 225px;
                    `}
                  >
                    {!values[priceKey].shouldContactForPrice && (
                      <FieldCurrencyInput
                        id={title}
                        name={`${priceKey}.price`}
                        className={css.priceInput}
                        autoFocus={index === 0}
                        label={title}
                        placeholder="Enter price..."
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
                        {title}
                      </label>
                    )}

                    <FieldCheckbox
                      id={`${title}-shouldContactForPrice`}
                      name={`${priceKey}.shouldContactForPrice`}
                      label="Contact for pricing"
                      format={Boolean}
                      parse={Boolean}
                    />
                  </div>

                  <div
                    css={css`
                      flex: 1;
                      margin-left: 2rem;
                      font-size: 14px;
                    `}
                  >
                    {description}
                  </div>
                </div>
              )
            })}

            <h2>Custom options</h2>

            {customOptions.map(({ code }) => {
              return (
                <div
                  key={code}
                  css={css`
                    margin-bottom: 1rem;
                  `}
                >
                  <FieldTextInput
                    id={`${code}.code`}
                    name={`${code}.code`}
                    initialValue={code}
                    type="hidden"
                  />

                  <FieldTextInput
                    id={`${code}.title`}
                    name={`${code}.title`}
                    label="Title"
                    initialValue="Custom title"
                    placeholder="Enter title..."
                    type="text"
                  />

                  <FieldTextInput
                    id={`${code}.description`}
                    name={`${code}.description`}
                    label="Description"
                    initialValue="Custom description"
                    placeholder="Enter description..."
                    type="text"
                  />
                </div>
              )
            })}

            <button
              css={css`
                margin-bottom: 2rem;
                cursor: pointer;
              `}
              type="button"
              onClick={handleAddCustomOption}
            >
              Add custom option
            </button>

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
  title: string.isRequired,
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
