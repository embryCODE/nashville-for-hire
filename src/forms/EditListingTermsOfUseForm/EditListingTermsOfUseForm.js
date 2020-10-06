import React, { useState } from 'react'
import { bool, func, shape, string } from 'prop-types'
import classNames from 'classnames'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FormattedMessage } from '../../util/reactIntl'
import { propTypes } from '../../util/types'
import config from '../../config'
import { Button, FieldCheckbox, Form } from '../../components'

import css from './EditListingTermsOfUseForm.css'

const EditListingTermsOfUseFormComponent = (props) => {
  const { initialValues } = props
  const { agreeToTermsOfUse } = initialValues
  const [submitDisabled, setSubmitDisabled] = useState(!agreeToTermsOfUse)

  return (<FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      render={(formRenderProps) => {
        const {
          ready,
          rootClassName,
          className,
          name,
          handleSubmit,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
        } = formRenderProps

        const classes = classNames(rootClassName || css.root, className)
        const submitReady = (updated && pristine) || ready
        const submitInProgress = updateInProgress

        const { updateListingError, showListingsError } = fetchErrors || {}
        const errorMessage = updateListingError ? (
          <p className={css.error}>
            <FormattedMessage id="EditListingTermsOfUseForm.updateFailed" />
          </p>
        ) : null

        const errorMessageShowListing = showListingsError ? (
          <p className={css.error}>
            <FormattedMessage id="EditListingTermsOfUseForm.showListingFailed" />
          </p>
        ) : null

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            {errorMessage}
            {errorMessageShowListing}

            <FieldCheckbox
              className={css.features}
              id={name}
              name={name}
              label={'I agree to terms of use'}
              value={'agree'}
              onClick={(val) => {
                val.persist()
                setSubmitDisabled(!submitDisabled)
              }}
            />

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

EditListingTermsOfUseFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
}

EditListingTermsOfUseFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  name: string.isRequired,
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
  filterConfig: propTypes.filterConfig,
}

const EditListingTermsOfUseForm = EditListingTermsOfUseFormComponent

export default EditListingTermsOfUseForm
