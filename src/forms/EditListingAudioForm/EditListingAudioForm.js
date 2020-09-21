import React, { Component } from 'react'
import { array, bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl'
import isEqual from 'lodash/isEqual'
import classNames from 'classnames'
import { propTypes } from '../../util/types'
import { isUploadImageOverLimitError } from '../../util/errors'
import { Button, Form } from '../../components'
import ReactS3Uploader from 'react-s3-uploader'

import css from './EditListingAudioForm.css'

const ACCEPT_AUDIO = 'audio/*'

export class EditListingAudioFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { imageUploadRequested: false }
    this.uploader = null
    this.handleUpload = this.handleUpload.bind(this)
    this.onImageUploadHandler = this.onImageUploadHandler.bind(this)
    this.submittedImages = []
  }

  handleUpload() {
    return 'blah'
  }

  onImageUploadHandler(file) {
    if (file) {
      this.setState({ imageUploadRequested: true })
      this.props
        .onImageUpload({ id: `${file.name}_${Date.now()}`, file })
        .then(() => {
          this.setState({ imageUploadRequested: false })
        })
        .catch(() => {
          this.setState({ imageUploadRequested: false })
        })
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        onImageUploadHandler={this.onImageUploadHandler}
        imageUploadRequested={this.state.imageUploadRequested}
        initialValues={{ images: this.props.images }}
        render={(formRenderProps) => {
          const {
            className,
            fetchErrors,
            handleSubmit,
            images,
            imageUploadRequested,
            invalid,
            disabled,
            ready,
            saveActionMsg,
            updated,
            updateInProgress,
          } = formRenderProps

          const { publishListingError, showListingsError, updateListingError, uploadImageError } =
            fetchErrors || {}
          const uploadOverLimit = isUploadImageOverLimitError(uploadImageError)

          let uploadImageFailed = null

          if (uploadOverLimit) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditListingAudioForm.imageUploadFailed.uploadOverLimit" />
              </p>
            )
          } else if (uploadImageError) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditListingAudioForm.imageUploadFailed.uploadFailed" />
              </p>
            )
          }

          // NOTE: These error messages are here since Audio panel is the last visible panel
          // before creating a new listing. If that order is changed, these should be changed too.
          // Create and show listing errors are shown above submit button
          const publishListingFailed = publishListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAudioForm.publishListingFailed" />
            </p>
          ) : null
          const showListingFailed = showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAudioForm.showListingFailed" />
            </p>
          ) : null

          const submittedOnce = this.submittedImages.length > 0
          // imgs can contain added images (with temp ids) and submitted images with uniq ids.
          const arrayOfImgIds = (imgs) =>
            imgs.map((i) => (typeof i.id === 'string' ? i.imageId : i.id))
          const imageIdsFromProps = arrayOfImgIds(images)
          const imageIdsFromPreviousSubmit = arrayOfImgIds(this.submittedImages)
          const imageArrayHasSameImages = isEqual(imageIdsFromProps, imageIdsFromPreviousSubmit)
          const pristineSinceLastSubmit = submittedOnce && imageArrayHasSameImages

          const submitReady = (updated && pristineSinceLastSubmit) || ready
          const submitInProgress = updateInProgress
          const submitDisabled =
            invalid || disabled || submitInProgress || imageUploadRequested || ready

          const classes = classNames(css.root, className)

          return (
            <Form
              className={classes}
              onSubmit={(e) => {
                this.submittedImages = images
                handleSubmit(e)
              }}
            >
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingAudioForm.updateFailed" />
                </p>
              ) : null}

              <ReactS3Uploader
                signingUrl="/s3/sign"
                signingUrlMethod="GET"
                accept={ACCEPT_AUDIO}
                // preprocess={}
                // onSignedUrl={}
                // onProgress={ (thing) => {
                //   // progress bar state
                // }}
                onError={ (thing) => {
                  console.log({ onError: thing })
                }}
                onFinish={thing=>console.log(thing)} // save to publicData as array of ['filename']
                uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                contentDisposition="auto"
                scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/ig, '')}
                server="http://localhost:9000"
                inputRef={cmp => this.uploadInput = cmp}
                autoUpload={true}
              />

              {uploadImageFailed}

              <p className={css.tip}>
                <FormattedMessage id="EditListingAudioForm.addAudioTip" />
              </p>
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
}

EditListingAudioFormComponent.defaultProps = { fetchErrors: null, images: [] }

EditListingAudioFormComponent.propTypes = {
  fetchErrors: shape({
    publishListingError: propTypes.error,
    showListingsError: propTypes.error,
    uploadImageError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  images: array,
  intl: intlShape.isRequired,
  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
}

export default compose(injectIntl)(EditListingAudioFormComponent)
