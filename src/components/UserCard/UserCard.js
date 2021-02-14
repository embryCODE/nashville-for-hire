import React from 'react'
import { string, func, oneOfType } from 'prop-types'
import { FormattedMessage } from '../../util/reactIntl'
import classNames from 'classnames'
import { NamedLink, InlineTextButton } from '../../components'
import { ensureUser, ensureCurrentUser } from '../../util/data'
import { propTypes } from '../../util/types'

import css from './UserCard.css'

const UserCard = (props) => {
  const { rootClassName, className, user, currentUser, onContactUser } = props

  const userIsCurrentUser = user && user.type === 'currentUser'
  const ensuredUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user)

  const ensuredCurrentUser = ensureCurrentUser(currentUser)
  const isCurrentUser =
    ensuredUser.id && ensuredCurrentUser.id && ensuredUser.id.uuid === ensuredCurrentUser.id.uuid

  const handleContactUserClick = () => {
    onContactUser(user)
  }

  const classes = classNames(rootClassName || css.root, className)

  const notCurrentUserLinks = ensuredUser.id ? (
    <div>
      <NamedLink className={css.link} name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
        View profile
      </NamedLink>

      <span className={css.linkSeparator}>•</span>

      <InlineTextButton rootClassName={css.contact} onClick={handleContactUserClick}>
        Contact
      </InlineTextButton>
    </div>
  ) : null

  const currentUserLinks = ensuredUser.id ? (
    <div>
      <NamedLink className={css.link} name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
        View profile
      </NamedLink>

      <span className={css.linkSeparator}>•</span>

      <NamedLink className={css.editProfileDesktop} name="ProfileSettingsPage">
        <FormattedMessage id="ListingPage.editProfileLink" />
      </NamedLink>
    </div>
  ) : null

  return (
    <div className={classes}>
      <div className={css.content}>
        <div className={css.info}>{isCurrentUser ? currentUserLinks : notCurrentUserLinks}</div>
      </div>
    </div>
  )
}

UserCard.defaultProps = {
  rootClassName: null,
  className: null,
  user: null,
  currentUser: null,
}

UserCard.propTypes = {
  rootClassName: string,
  className: string,
  user: oneOfType([propTypes.user, propTypes.currentUser]),
  currentUser: propTypes.currentUser,
  onContactUser: func.isRequired,
}

export default UserCard
