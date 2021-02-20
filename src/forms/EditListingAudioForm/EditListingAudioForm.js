import React, { Component } from 'react'
import { array, bool, func, shape, string } from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl'
import classNames from 'classnames'
import { propTypes } from '../../util/types'
import { Button, FieldTextInput, Form } from '../../components'
import ReactS3Uploader from 'react-s3-uploader'
import css from './EditListingAudioForm.css'
import { s3AudioBucketName, s3UrlSigningServer, s3UrlSigningUrl } from '../../config'
import styled from 'styled-components/macro'

const ACCEPT_AUDIO = 'audio/*'

const Card = styled.div`
  background: #fff;
  border-radius: 4px;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  width: 100%;
  padding: 1rem;

  margin-bottom: 1rem;

  h3 {
    margin-top: 0;
  }
`

export class EditListingAudioFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentFileName: '',
      listingId: props.listingId,
      audio: props.audio,
      isLoading: false,
    }
    this.uploader = null
    this.handleUpload = this.handleUpload.bind(this)
  }

  handleUpload(fileName) {
    this.setState((prevState) => ({
      audio: [...prevState.audio, { fileName }],
    }))
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        initialValues={this.props.audio.reduce((acc, curr, i) => {
          return { ...acc, [`audioObject-${i}`]: curr }
        }, {})}
        render={(formRenderProps) => {
          const {
            className,
            fetchErrors,
            saveActionMsg,
            handleSubmit,
            valid,
            updated,
            pristine,
            ready,
            updateInProgress,
          } = formRenderProps
          const { updateListingError } = fetchErrors || {}
          const classes = classNames(css.root, className)

          const namespace = 'listing-id-' + this.state.listingId.uuid
          const tags = `daysUntilExpiration=0`
          const required = (value) => (value ? undefined : 'Required')
          const submitReady = (updated && pristine) || ready
          const inProgress = updateInProgress || this.state.isLoading

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingAudioForm.updateFailed" />
                </p>
              ) : null}

              <div>
                {this.state.audio.map(({ fileName }, index) => (
                  <Card key={fileName + index}>
                    <div>
                      <h3>{fileName.split('/')[1]}</h3>

                      <FieldTextInput
                        id="fileName"
                        type="hidden"
                        name={`audioObject-${index}.fileName`}
                        initialValue={fileName}
                        validate={required}
                      />

                      <FieldTextInput
                        id="name"
                        type="text"
                        name={`audioObject-${index}.name`}
                        label="Sample Name"
                        placeholder="Bluesy Jams"
                        validate={required}
                      />

                      <FieldTextInput
                        id="description"
                        type="textarea"
                        name={`audioObject-${index}.description`}
                        label="What was your involvement on this track?"
                        placeholder="I played the guitar and sang harmonies"
                        validate={required}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <h3>Add audio</h3>

              <ReactS3Uploader
                signingUrl={s3UrlSigningUrl}
                signingUrlQueryParams={{
                  bucketName: s3AudioBucketName,
                  namespace,
                }}
                signingUrlMethod="GET"
                accept={ACCEPT_AUDIO}
                onSignedUrl={(res) => {
                  this.handleUpload(res.filename)
                }}
                onProgress={() => {
                  this.setState({ isLoading: true })
                }}
                onError={(err) => {
                  console.error({ onError: err })
                  this.setState({ isLoading: false })
                }}
                onFinish={() => {
                  this.setState({ isLoading: false })
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
                inProgress={inProgress}
                disabled={!valid}
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
  fetchErrors: shape({ showListingsError: propTypes.error, updateListingError: propTypes.error }),
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
