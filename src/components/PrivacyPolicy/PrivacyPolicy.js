import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import css from './PrivacyPolicy.css'

const PrivacyPolicy = (props) => {
  const { rootClassName, className } = props
  const classes = classNames(rootClassName || css.root, className)

  return (
    <div className={classes}>
      <p className={css.lastUpdated}>Last updated: May 31, 2021</p>
      <p>
        We don't harvest your data or sell it. Period. We are in the music business, not the data
        business.
      </p>
      <p>
        If you ever have any questions, reach out:{' '}
        <a href="mailto:hello@nashvilleforhire.com">hello@nashvilleforhire.com</a>
      </p>
    </div>
  )
}

PrivacyPolicy.defaultProps = {
  rootClassName: null,
  className: null,
}

const { string } = PropTypes

PrivacyPolicy.propTypes = {
  rootClassName: string,
  className: string,
}

export default PrivacyPolicy
