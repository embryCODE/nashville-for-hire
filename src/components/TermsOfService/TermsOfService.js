import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import css from './TermsOfService.css'

const TermsOfService = (props) => {
  const { rootClassName, className } = props
  const classes = classNames(rootClassName || css.root, className)

  return (
    <div className={classes}>
      <p className={css.lastUpdated}>Last updated: May 28, 2021</p>

      <p>
        The Nashville For Hire Marketplace is a curated marketplace that connects you to amazingly
        talented Nashville music professionals. We help you make that connection, BUT we do not own
        ANY of the materials, songs, lyrics, melodies, rights, content, etc that gets transferred
        through us or created through us.
      </p>

      <p>
        Any terms of ownership or royalties are to be discussed on a case by case basis{' '}
        <strong>between you and your Nashville Seller</strong> (the Nashville music professional you
        choose to hire).
      </p>

      <p>
        In most situations we see on Nashville For Hire, the agreement is a “Work For Hire”. This
        means that YOU keep all your rights and the guitarist, drummer, producer, vocalist, audio
        engineer, etc gives you the rights to her/his performance on that song.
      </p>

      <p>
        If you hire songwriting or topline, you will most likely have different price ranges
        depending on whether the songwriter keeps a percentage of ownership or if she / he gives
        over all rights (the <em>Work For Hire</em> agreement).
      </p>

      <p>
        <strong>
          If you want advice or guidance in this process, email us at{' '}
          <a href="mailto:hello@nashvilleforhire.com">hello@nashvilleforhire.com</a>
        </strong>
      </p>
    </div>
  )
}

TermsOfService.defaultProps = {
  rootClassName: null,
  className: null,
}

const { string } = PropTypes

TermsOfService.propTypes = {
  rootClassName: string,
  className: string,
}

export default TermsOfService
