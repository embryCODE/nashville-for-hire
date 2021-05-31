import React from 'react'
import { string } from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl'
import classNames from 'classnames'
import { twitterPageURL } from '../../util/urlHelpers'
import config from '../../config'
import {
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  ExternalLink,
  NamedLink,
} from '../../components'
import nfhLogoWhite from '../../assets/images/nfhLogoWhite.png'

import css from './Footer.css'

const renderSocialMediaLinks = (intl) => {
  const { siteFacebookPage, siteInstagramPage, siteTwitterHandle } = config
  const siteTwitterPage = twitterPageURL(siteTwitterHandle)

  const goToFb = intl.formatMessage({ id: 'Footer.goToFacebook' })
  const goToInsta = intl.formatMessage({ id: 'Footer.goToInstagram' })
  const goToTwitter = intl.formatMessage({ id: 'Footer.goToTwitter' })

  const fbLink = siteFacebookPage ? (
    <ExternalLink key="linkToFacebook" href={siteFacebookPage} className={css.icon} title={goToFb}>
      <IconSocialMediaFacebook />
    </ExternalLink>
  ) : null

  const twitterLink = siteTwitterPage ? (
    <ExternalLink
      key="linkToTwitter"
      href={siteTwitterPage}
      className={css.icon}
      title={goToTwitter}
    >
      <IconSocialMediaTwitter />
    </ExternalLink>
  ) : null

  const instragramLink = siteInstagramPage ? (
    <ExternalLink
      key="linkToInstagram"
      href={siteInstagramPage}
      className={css.icon}
      title={goToInsta}
    >
      <IconSocialMediaInstagram />
    </ExternalLink>
  ) : null
  return [fbLink, twitterLink, instragramLink].filter((v) => v != null)
}

const Footer = (props) => {
  const { rootClassName, className, intl } = props
  const socialMediaLinks = renderSocialMediaLinks(intl)
  const classes = classNames(rootClassName || css.root, className)

  return (
    <div className={classes}>
      <div className={css.topBorderWrapper}>
        <div className={css.content}>
          <div className={css.someLiksMobile}>{socialMediaLinks}</div>
          <div className={css.links}>
            <div className={css.organization} id="organization">
              <a className={css.logoLink} href="https://nashvilleforhire.com">
                <img width={80} src={nfhLogoWhite} alt="Nashville For Hire logo" />
              </a>
              <div className={css.organizationInfo}>
                <p className={css.organizationDescription}>
                  We help music creatives all over the world create better music, stay in budget and
                  do it all with less stress.
                </p>
              </div>
            </div>

            <div className={css.infoLinks}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <a href="https://www.nashvilleforhire.com/help" className={css.link}>
                    <FormattedMessage id="Footer.toHelpPage" />
                  </a>
                </li>
                <li className={css.listItem}>
                  <a
                    href="https://www.nashvilleforhire.com/assessments/2147504856"
                    className={css.link}
                  >
                    <FormattedMessage id="Footer.toContactPage" />
                  </a>
                </li>
              </ul>
            </div>

            <div className={css.extraLinks}>
              <div className={css.someLinks}>{socialMediaLinks}</div>
              <div className={css.legalMatters}>
                <ul className={css.tosAndPrivacy}>
                  <li>
                    <NamedLink name="LandingPage" className={css.organizationCopyrightMobile}>
                      <FormattedMessage id="Footer.copyright" />
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink name="TermsOfServicePage" className={css.legalLink}>
                      <FormattedMessage id="Footer.termsOfUse" />
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink name="PrivacyPolicyPage" className={css.legalLink}>
                      <FormattedMessage id="Footer.privacyPolicy" />
                    </NamedLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={css.copyrightAndTermsMobile}>
            <NamedLink name="LandingPage" className={css.organizationCopyrightMobile}>
              <FormattedMessage id="Footer.copyright" />
            </NamedLink>
            <div className={css.tosAndPrivacyMobile}>
              <NamedLink name="PrivacyPolicyPage" className={css.privacy}>
                <FormattedMessage id="Footer.privacy" />
              </NamedLink>
              <NamedLink name="TermsOfServicePage" className={css.terms}>
                <FormattedMessage id="Footer.terms" />
              </NamedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Footer.defaultProps = {
  rootClassName: null,
  className: null,
}

Footer.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
}

export default injectIntl(Footer)
