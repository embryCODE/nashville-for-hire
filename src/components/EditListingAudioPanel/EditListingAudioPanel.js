import React, { Component } from 'react'
import { array, bool, func, object, string } from 'prop-types'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import { LISTING_STATE_DRAFT } from '../../util/types'
import { EditListingAudioForm } from '../../forms'
import { ensureOwnListing } from '../../util/data'
import { ListingLink } from '../../components'

import css from './EditListingAudioPanel.css'

class EditListingAudioPanel extends Component {
  render() {
    const {
      className,
      rootClassName,
      errors,
      disabled,
      ready,
      listing,
      onUpdateImageOrder,
      submitButtonText,
      panelUpdated,
      updateInProgress,
      onChange,
      onRemoveImage,
      onSubmit,
      onSaveAudio,
    } = this.props

    const rootClass = rootClassName || css.root
    const classes = classNames(rootClass, className)
    const currentListing = ensureOwnListing(listing)

    const { publicData } = currentListing.attributes

    const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT
    const panelTitle = isPublished ? (
      <FormattedMessage
        id="EditListingAudioPanel.title"
        values={{ listingTitle: <ListingLink listing={listing} /> }}
      />
    ) : (
      <FormattedMessage id="EditListingAudioPanel.createListingTitle" />
    )

    const panelInformation = (
      <p style={{ fontSize: 14 }}>
        <em>Upload 1-4 audio samples that show what you can do.</em>
      </p>
    )

    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>

        {panelInformation}

        <EditListingAudioForm
          listingId={currentListing.id}
          initialValues={publicData.audio || []}
          className={css.form}
          disabled={disabled}
          ready={ready}
          fetchErrors={errors}
          onSaveAudio={(audio = {}) => {
            const updateValues = {
              publicData: { audio: Object.values(audio) },
            }

            onSaveAudio(updateValues)
          }}
          onSubmit={(audio = {}) => {
            const updateValues = {
              publicData: { audio: Object.values(audio) },
            }

            onSubmit(updateValues)
          }}
          onChange={onChange}
          onUpdateImageOrder={onUpdateImageOrder}
          onRemoveImage={onRemoveImage}
          saveActionMsg={submitButtonText}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
        />
      </div>
    )
  }
}

EditListingAudioPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  audio: [],
  listing: null,
}

EditListingAudioPanel.propTypes = {
  className: string,
  rootClassName: string,
  errors: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  audio: array,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onChange: func.isRequired,
  onSubmit: func.isRequired,
  onSaveAudio: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
}

export default EditListingAudioPanel
