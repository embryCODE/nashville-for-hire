import React, { Component } from 'react'
import { string, bool, arrayOf } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl'
import classNames from 'classnames'
import { START_DATE, END_DATE } from '../../util/dates'
import { propTypes } from '../../util/types'
import { Form, PrimaryButton } from '../../components'
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe'
import css from './BookingDatesForm.css'
import * as PropTypes from 'prop-types'

export class BookingDatesFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { focusedInput: null }
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.onFocusedInputChange = this.onFocusedInputChange.bind(this)
  }

  // Function that can be passed to nested components
  // so that they can notify this component when the
  // focused input changes.
  onFocusedInputChange(focusedInput) {
    this.setState({ focusedInput })
  }

  // In case start or end date for the booking is missing
  // focus on that input, otherwise continue with the
  // default handleSubmit function.
  handleFormSubmit(e) {
    const { startDate, endDate } = e.bookingDates || {}
    if (!startDate) {
      e.preventDefault()
      this.setState({ focusedInput: START_DATE })
    } else if (!endDate) {
      e.preventDefault()
      this.setState({ focusedInput: END_DATE })
    } else {
      this.props.onSubmit(e)
    }
  }

  render() {
    const { rootClassName, className, prices, ...rest } = this.props
    const classes = classNames(rootClassName || css.root, className)

    return (
      <FinalForm
        {...rest}
        onSubmit={this.handleFormSubmit}
        render={(fieldRenderProps) => {
          const { handleSubmit, isOwnListing, submitButtonWrapperClassName } = fieldRenderProps

          const bookingData = {
            prices,
          }

          const bookingInfo = bookingData ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingDatesForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe bookingData={bookingData} />
            </div>
          ) : null

          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper,
          )

          return (
            <Form onSubmit={handleSubmit} className={classes}>
              {bookingInfo}
              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingDatesForm.ownListing'
                      : 'BookingDatesForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingDatesForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          )
        }}
      />
    )
  }
}

BookingDatesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  prices: [],
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
}

BookingDatesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  prices: PropTypes.object,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
}

const BookingDatesForm = compose(injectIntl)(BookingDatesFormComponent)
BookingDatesForm.displayName = 'BookingDatesForm'

export default BookingDatesForm
