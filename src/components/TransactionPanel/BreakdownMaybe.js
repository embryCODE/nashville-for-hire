import React from 'react'
import classNames from 'classnames'
import { BookingBreakdown } from '../../components'

import css from './TransactionPanel.css'

// Functional component as a helper to build BookingBreakdown
const BreakdownMaybe = (props) => {
  const { className, rootClassName, breakdownClassName, transaction, transactionRole } = props
  const loaded = transaction && transaction.id

  const classes = classNames(rootClassName || css.breakdownMaybe, className)
  const breakdownClasses = classNames(breakdownClassName || css.breakdown)

  return loaded ? (
    <div className={classes}>
      <BookingBreakdown
        className={breakdownClasses}
        userRole={transactionRole}
        transaction={transaction}
      />
    </div>
  ) : null
}

export default BreakdownMaybe
