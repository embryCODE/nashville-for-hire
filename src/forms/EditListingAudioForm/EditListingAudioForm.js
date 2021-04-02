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
import {
  cognitoIdentityPoolId,
  s3AudioBucketName,
  s3UrlSigningServer,
  s3UrlSigningUrl,
} from '../../config'
import styled from 'styled-components/macro'
import AWS from 'aws-sdk'

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

AWS.config.region = 'us-east-2'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: cognitoIdentityPoolId,
})

const removeDot = (string) => {
  return string.replace('.', '_')
}

export class EditListingAudioFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
    this.uploader = null
    this.formattedInitialValues = this.props.initialValues.reduce((acc, curr) => {
      return { ...acc, [removeDot(curr.fileName)]: curr }
    }, {})
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        initialValues={this.formattedInitialValues}
        render={(formRenderProps) => {
          const {
            className,
            fetchErrors,
            saveActionMsg,
            handleSubmit,
            valid,
            updateInProgress,
            values,
            form,
            onSaveAudio,
          } = formRenderProps
          const { updateListingError } = fetchErrors || {}
          const classes = classNames(css.root, className)
          const namespace = 'listing-id-' + this.props.listingId.uuid
          const tags = `daysUntilExpiration=0`
          const required = (value) => (value ? undefined : 'Required')
          const inProgress = updateInProgress || this.state.isLoading
          const isValid = Object.values(values).length && valid

          const handleUpload = (fileName) => {
            const key = removeDot(fileName)
            form.change(key, { fileName })
            onSaveAudio(form.getState().values)
          }

          const handleDelete = (fileName) => {
            const s3 = new AWS.S3({ params: { Bucket: s3AudioBucketName } })
            const getParams = { Bucket: s3AudioBucketName, Key: fileName }

            s3.deleteObject(getParams, (err) => {
              if (err) {
                console.error(err)
                return
              }

              const key = removeDot(fileName)
              form.change(key, undefined)
              onSaveAudio(form.getState().values)
            })
          }

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingAudioForm.updateFailed" />
                </p>
              ) : null}

              <div>
                {Object.values(values).map((audioObject) => {
                  const key = removeDot(audioObject.fileName)

                  return (
                    <Card key={key}>
                      <div>
                        <h3>{audioObject.fileName.split('/')[1]}</h3>

                        <FieldTextInput
                          id={`${key}-name`}
                          type="text"
                          name={`${key}.name`}
                          label="Sample Name"
                          placeholder="Bluesy Jams"
                          validate={required}
                        />

                        <FieldTextInput
                          id={`${key}-description`}
                          type="textarea"
                          name={`${key}.description`}
                          label="What was your involvement on this track?"
                          placeholder="I played the guitar and sang harmonies"
                          validate={required}
                        />
                      </div>

                      <button
                        type="button"
                        css={{ marginTop: '1rem' }}
                        onClick={() => handleDelete(key)}
                      >
                        Delete
                      </button>
                    </Card>
                  )
                })}
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
                  handleUpload(res.filename)
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
  initialValues: array,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  onSaveAudio: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
}

export default compose(injectIntl)(EditListingAudioFormComponent)
