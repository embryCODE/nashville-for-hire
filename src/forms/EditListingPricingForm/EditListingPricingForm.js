import React from 'react'
import { bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl'
import classNames from 'classnames'
import config from '../../config'
import { propTypes } from '../../util/types'
import { Button, Form, FieldCurrencyInput, FieldCheckbox, FieldTextInput } from '../../components'
import { css } from 'styled-components/macro'
import styled from 'styled-components'
import { v4 } from 'uuid'

const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
  }

  p {
    font-size: 14px;
    font-style: italic;
    margin-top: 0.5rem;
  }
`

const FormWrapper = styled.div`
  display: flex;

  div {
    flex: 1;
  }
`

const isOptionCustom = (option) => {
  return option.code.includes('custom')
}

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
      mutators={{
        addCustomOption: ([customOption], state) => {
          const newValues = { ...state.formState.values, [customOption.code]: customOption }
          state.formState.values = newValues
        },
        deleteOption: ([optionToDelete], state) => {
          delete state.formState.values[optionToDelete.code]
        },
      }}
      render={({
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
        form,
      }) => {
        const addCustomOption = () => {
          const code = `custom-${v4()}`
          const customOption = { code }

          form.mutators.addCustomOption(customOption)
        }

        const deleteCustomOption = (optionToDelete) => {
          form.mutators.deleteOption(optionToDelete)
        }

        const sortedValues = Object.entries(values).sort(([aCode], [bCode]) => {
          if (aCode.includes('custom')) return 1
          if (bCode.includes('custom')) return -1

          return aCode < bCode ? -1 : aCode > bCode ? 1 : 0
        })

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

            {sortedValues.map(([code, option], index) => {
              return (
                <Card key={code}>
                  <FieldTextInput
                    id={`${code}-code`}
                    name={`${code}.code`}
                    initialValue={code}
                    type="hidden"
                  />

                  {isOptionCustom(option) ? (
                    <>
                      <FieldTextInput
                        id={`${code}-title`}
                        name={`${code}.title`}
                        label="Title"
                        initialValue=""
                        placeholder="Enter title..."
                        type="text"
                      />
                      <FieldTextInput
                        id={`${code}-description`}
                        name={`${code}.description`}
                        label="Description"
                        initialValue=""
                        placeholder="Enter description..."
                        type="text"
                      />
                    </>
                  ) : (
                    <>
                      <h2>{option.title}</h2>
                      <p>{option.description}</p>
                    </>
                  )}

                  <FormWrapper>
                    <div>
                      {/* I hate Final Form. I have to refer to the value in the form itself here. */}
                      {values[code] && values[code].shouldContactForPrice ? (
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
                          {option.title}
                        </label>
                      ) : (
                        <FieldCurrencyInput
                          id={`${code}-price`}
                          name={`${code}.price`}
                          className={css.priceInput}
                          autoFocus={index === 0}
                          label="Price"
                          placeholder="Enter price..."
                          currencyConfig={config.currencyConfig}
                          data-test={`${code}-input`}
                        />
                      )}

                      <FieldCheckbox
                        id={`${code}-shouldContactForPrice`}
                        name={`${code}.shouldContactForPrice`}
                        label="Contact for pricing"
                        format={Boolean}
                        parse={Boolean}
                      />

                      {isOptionCustom(option) && (
                        <button
                          css={{ marginTop: '1rem', cursor: 'pointer' }}
                          onClick={() => deleteCustomOption(option)}
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div
                      css={css`
                        flex: 1;
                        margin-left: 2rem;
                        font-size: 14px;
                      `}
                    >
                      <FieldTextInput
                        id={`${code}-turnaroundTime`}
                        name={`${code}.turnaroundTime`}
                        label="Turnaround time"
                        initialValue=""
                        placeholder="1 week"
                        type="text"
                      />
                    </div>
                  </FormWrapper>
                </Card>
              )
            })}

            <button
              css={css`
                margin-bottom: 2rem;
                cursor: pointer;
              `}
              type="button"
              onClick={addCustomOption}
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
EditListingPricingFormComponent.defaultProps = {
  fetchErrors: null,
}

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
