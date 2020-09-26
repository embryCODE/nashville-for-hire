import React, { Component } from 'react'
import { array, bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl'
import isEqual from 'lodash/isEqual'
import classNames from 'classnames'
import { propTypes } from '../../util/types'
import { Button, Form } from '../../components'
import ReactS3Uploader from 'react-s3-uploader'

import css from './EditListingAudioForm.css'

const ACCEPT_AUDIO = 'audio/*'

export class EditListingAudioFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { audioUploadRequested: false, currentFileName: '', currentFileProgress: 0  }
    this.uploader = null
    this.handleUpload = this.handleUpload.bind(this)
    this.handleUploadProgress = this.handleUploadProgress.bind(this)
    this.submittedAudio = []
  }

  handleUploadProgress({ type, value, fileName }) {
    if (type === 'fileName') {
      this.setState({currentFileName: fileName})
    } else {
      this.setState({currentFileProgress: value})
    }
  }

  handleUpload(fileName) {
    this.setState({ audioUploadRequested: true })
    this.submittedAudio = [...this.submittedAudio, fileName]
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        audioUploadRequested={this.state.audioUploadRequested}
        render={(formRenderProps) => {
          const {
            className,
            fetchErrors,
            audio,
            audioUploadRequested,
            invalid,
            disabled,
            bypassHandleSubmit,
            ready,
            saveActionMsg,
            updated,
            updateInProgress,
          } = formRenderProps

          const { updateListingError } =
            fetchErrors || {}

          const submittedOnce = this.submittedAudio.length > 0
          // audio can contain added audios (with temp ids) and submitted audios with uniq ids.
          const arrayOfAudioIds = (audio) =>
            audio.map((i) => (typeof i.id === 'string' ? i.audioId : i.id))
          const audioIdsFromProps = arrayOfAudioIds(audio)
          const audioIdsFromPreviousSubmit = arrayOfAudioIds(this.submittedAudio)
          const audioArrayHasSameImages = isEqual(audioIdsFromProps, audioIdsFromPreviousSubmit)
          const pristineSinceLastSubmit = submittedOnce && audioArrayHasSameImages

          const submitReady = (updated && pristineSinceLastSubmit) || ready
          const submitInProgress = updateInProgress
          const submitDisabled =
            invalid || disabled || submitInProgress || audioUploadRequested || ready

          const classes = classNames(css.root, className)

          const listAudio = this.submittedAudio.length > 0 ?
            (<ul>
              { this.submittedAudio.map((fileName, index) =>
                <li key={fileName + index}>
                  {fileName}
                  { this.state.currentFileName === fileName ? <div style={{width: 200, height: 15, border: '1px solid red'}}>
                    <div style={{ width: this.state.currentFileProgress * 2, height: 15, background: 'green' }}/>
                  </div>:<div style={{ width: 200, height: 15, background: 'green' }}/>}
                </li>)
              }
            </ul>) : <></>

          return (
            <Form
              className={classes}
              onSubmit={(e) => {
                bypassHandleSubmit({ audio: this.submittedAudio})
                e.preventDefault()
              }}
            >
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingAudioForm.updateFailed" />
                </p>
              ) : null}

              { listAudio }

              <ReactS3Uploader
                signingUrl="/s3/sign"
                signingUrlMethod="GET"
                accept={ACCEPT_AUDIO}
                // preprocess={(thing)=> console.log({thing})} // keeping just in case
                onSignedUrl={(res) => {
                  this.handleUploadProgress({ type: 'fileName', fileName: res.filename })
                  this.handleUpload(res.filename)
                }}
                onProgress={ (value) => {
                  this.handleUploadProgress({ type: 'value', value })
                }}
                onError={ (err) => {
                  console.log({ onError: err })
                }}
                onFinish={()=> {
                  this.setState({ audioUploadRequested: false })
                  this.handleUploadProgress({ type: 'fileName', fileName: '' })
                  this.handleUploadProgress({ type: 'value', value: 0 })
                }} // save to publicData as array of ['filename']
                uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                contentDisposition="auto"
                scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/ig, '')}
                server="http://localhost:9000"
                inputRef={cmp => this.uploadInput = cmp}
                autoUpload={true}
              />

              <p className={css.tip}>
                <FormattedMessage id="EditListingAudioForm.addAudioTip" />
              </p>

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
}

export default compose(injectIntl)(EditListingAudioFormComponent)