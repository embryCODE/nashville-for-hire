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

const ACCEPT_AUDIO = 'audio/*'
const S3_URL_SIGNING_SERVER = 'https://kwk9zvlg29.execute-api.us-east-2.amazonaws.com/nonprod'
const S3_URL_SIGNING_SERVER_URL = '/nfh-s3-url-signer'

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
                    {fileName}

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
                signingUrl={S3_URL_SIGNING_SERVER_URL}
                signingUrlQueryParams={{
                  namespace: 'listing-id-' + this.state.listingId.uuid,
                }}
                signingUrlMethod="GET"
                accept={ACCEPT_AUDIO}
                // preprocess={(thing)=> console.log({thing})} // keeping just in case
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
                uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
                contentDisposition="auto"
                scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, '')}
                server={S3_URL_SIGNING_SERVER}
                inputRef={(cmp) => (this.uploadInput = cmp)}
                autoUpload={true}
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
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
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
