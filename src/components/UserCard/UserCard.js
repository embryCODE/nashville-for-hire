import React from 'react'
import { string, func, oneOfType } from 'prop-types'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import { NamedLink, PrimaryButton } from '../../components'
import { ensureUser, ensureCurrentUser } from '../../util/data'
import { propTypes } from '../../util/types'
import styled from 'styled-components'
import css from './UserCard.css'

const ContactButton = styled((props) => <PrimaryButton {...props} />)`
  display: inline-block;
  background-color: #cd8575;
  width: auto;
  height: 48px;
  min-height: unset;
  padding: 0 0.75rem;
  margin-left: 1rem;

  &:hover {
    background-color: #cd8575;
    opacity: 0.8;
  }
`

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

      <ContactButton onClick={handleContactUserClick}>Contact</ContactButton>
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
