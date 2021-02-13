import React, { Component } from 'react'
import { array, bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl'
import classNames from 'classnames'
import { propTypes } from '../../util/types'
import { Button, Form } from '../../components'
import ReactS3Uploader from 'react-s3-uploader'
import css from './EditListingAudioForm.css'
import { s3AudioBucketName, s3UrlSigningServer, s3UrlSigningUrl } from '../../config'

const ACCEPT_AUDIO = 'audio/*'

export class EditListingAudioFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      audioUploadRequested: false,
      currentFileName: '',
      currentFileProgress: 0,
      listingId: props.listingId,
      audio: props.audio,
    }
    this.uploader = null
    this.handleUpload = this.handleUpload.bind(this)
    this.handleUploadProgress = this.handleUploadProgress.bind(this)
  }

  handleUploadProgress({ type, value, fileName }) {
    if (type === 'fileName') {
      this.setState({ currentFileName: fileName })
    } else {
      this.setState({ currentFileProgress: value })
    }
  }

  handleUpload(fileName) {
    const formattedAudioObject = { fileName, title: 'Not yet implemented' }

    this.setState((prevState) => ({
      audioUploadRequested: true,
      audio: [...prevState.audio, formattedAudioObject],
    }))
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={(formRenderProps) => {
          const { className, fetchErrors, bypassDefaultSubmit, saveActionMsg } = formRenderProps
          const { updateListingError } = fetchErrors || {}
          const submitInProgress =
            this.state.audioUploadRequested && this.state.currentFileProgress !== 100
          const isSubmitDisabled = false // TODO: Implement this
          const classes = classNames(css.root, className)

          const handleSubmit = (e) => {
            e.preventDefault()

            bypassDefaultSubmit(this.state.audio)
          }

          const namespace = 'listing-id-' + this.state.listingId.uuid
          const tags = `daysUntilExpiration=0`

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingAudioForm.updateFailed" />
                </p>
              ) : null}

              <ul>
                {this.state.audio.map(({ fileName }, index) => (
                  <li key={fileName + index} style={{ marginBottom: 12 }}>
                    {fileName.split('/')[1]}

                    {this.state.currentFileName === fileName ? (
                      <div
                        style={{
                          width: 200,
                          height: 15,
                          border: '2px solid red',
                          boxSizing: 'unset',
                        }}
                      >
                        <div
                          style={{
                            width: this.state.currentFileProgress * 2,
                            height: '100%',
                            background: 'green',
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ width: 200, height: 15, background: 'green' }} />
                    )}
                  </li>
                ))}
              </ul>

              <ReactS3Uploader
                signingUrl={s3UrlSigningUrl}
                signingUrlQueryParams={{
                  bucketName: s3AudioBucketName,
                  namespace,
                }}
                signingUrlMethod="GET"
                accept={ACCEPT_AUDIO}
                onSignedUrl={(res) => {
                  this.handleUploadProgress({ type: 'fileName', fileName: res.filename })
                  this.handleUpload(res.filename)
                }}
                onProgress={(value) => {
                  this.handleUploadProgress({ type: 'value', value })
                }}
                onError={(err) => {
                  console.error({ onError: err })
                }}
                onFinish={() => {
                  this.setState({ audioUploadRequested: false })
                  this.handleUploadProgress({ type: 'fileName', fileName: '' })
                  this.handleUploadProgress({ type: 'value', value: 0 })
                }}
                uploadRequestHeaders={{ 'x-amz-acl': 'public-read', 'x-amz-tagging': tags }}
                contentDisposition="auto"
                scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, '')}
                server={s3UrlSigningServer}
                autoUpload={true}
                // preprocess={(thing)=> console.log({thing})} // keeping just in case
                // inputRef={}
              />

              <p className={css.tip}>
                <FormattedMessage id="EditListingAudioForm.addAudioTip" />
              </p>

              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={isSubmitDisabled}
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

EditListingAudioFormComponent.defaultProps = { fetchErrors: null, audio: [] }

EditListingAudioFormComponent.propTypes = {
  fetchErrors: shape({ showListingsError: propTypes.error, updateListingError: propTypes.error }),
  audio: array,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  bypassDefaultSubmit: func.isRequired,
}

export default compose(injectIntl)(EditListingAudioFormComponent)
