import React from 'react'
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
  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      validate={(values) => {
        const errors = {}

        if (values.agreeToTermsOfUse !== true) {
          errors.agreeToTermsOfUse = 'You must agree to the terms of use'
        }

        return errors
      }}
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
          invalid,
          disabled,
        } = formRenderProps

        const classes = classNames(rootClassName || css.root, className)
        const submitReady = (updated && pristine) || ready
        const submitInProgress = updateInProgress
        const submitDisabled = invalid || disabled || submitInProgress

        const { updateListingError, showListingsError, publishListingError } = fetchErrors || {}
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

        const publishListingFailed = publishListingError ? (
          <p className={css.error}>
            <FormattedMessage id="EditListingPhotosForm.publishListingFailed" />
          </p>
        ) : null
        const showListingFailed = showListingsError ? (
          <p className={css.error}>
            <FormattedMessage id="EditListingPhotosForm.showListingFailed" />
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
            />

            {publishListingFailed}
            {showListingFailed}

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
