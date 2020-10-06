import React from 'react'
import { bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl'
import classNames from 'classnames'
import { propTypes } from '../../util/types'
import { Button, Form, FieldTextInput } from '../../components'
import css from './EditListingContactForm.css'
import { composeValidators, maxLength, required } from '../../util/validators'
import FieldPhoneNumberInput from '../../components/FieldPhoneNumberInput/FieldPhoneNumberInput'
import * as normalizePhoneNumberUS from '../PayoutDetailsForm/normalizePhoneNumberUS'

const TITLE_MAX_LENGTH = 15

export const EditListingContactFormComponent = (props) => {
  return (< FinalForm
      {...
        props
      }
      render={(formRenderProps) => {
        const {
          className,
          disabled,
          ready,
          handleSubmit,
          intl,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
        } = formRenderProps

        const classes = classNames(css.root, className)
        const submitReady = (updated && pristine) || ready
        const submitInProgress = updateInProgress
        const submitDisabled = invalid || disabled || submitInProgress
        const { updateListingError, showListingsError } = fetchErrors || {}

        const questionBTitle = intl.formatMessage({ id: 'EditListingContactForm.questionBTitle' })
        const questionBTitlePlaceholderMessage = intl.formatMessage({
          id: 'EditListingContactForm.questionBTitlePlaceholder',
        })

        const titleRequiredMessage = intl.formatMessage({
          id: 'EditListingContactForm.phoneNumberRequired',
        })
        const maxLengthMessage = intl.formatMessage(
          { id: 'EditListingServiceTypeForm.maxLength' },
          {
            maxLength: TITLE_MAX_LENGTH,
          },
        )

        const maxLength15Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH)

        return (
          <Form onSubmit={handleSubmit} className={classes}>
            {updateListingError ? (
              <p className={css.error}>
                <FormattedMessage id="EditListingContactForm.updateFailed"/>
              </p>
            ) : null}
            {showListingsError ? (
              <p className={css.error}>
                <FormattedMessage id="EditListingContactForm.showListingFailed"/>
              </p>
            ) : null}

            <FieldPhoneNumberInput
              id="phoneNumber"
              name="phoneNumber"
              className={css.title}
              type="tel"
              autoComplete="tel-national"
              format={normalizePhoneNumberUS.format}
              parse={normalizePhoneNumberUS.parse}
              label={questionBTitle}
              placeholder={questionBTitlePlaceholderMessage}
              maxLength={TITLE_MAX_LENGTH}
              validate={composeValidators(required(titleRequiredMessage), maxLength15Message)}
              autoFocus
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
      }
      }
    />
  )
}
EditListingContactFormComponent.defaultProps = { fetchErrors: null }

EditListingContactFormComponent.propTypes = {
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

export default compose(injectIntl)(EditListingContactFormComponent)
