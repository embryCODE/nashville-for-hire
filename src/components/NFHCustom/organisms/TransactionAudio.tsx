import React, { useEffect, useState } from 'react'
import {
  s3UrlSigningServer,
  s3UrlSigningUrl,
  cognitoIdentityPoolId,
  s3AudioBucketName,
} from '../../../config'
import ReactS3Uploader from 'react-s3-uploader'
import AWS from 'aws-sdk'
import styled, { css } from 'styled-components/macro'
import { LoadingSpinner } from '../molecules/LoadingSpinner'
import { Audio } from './Audio'

AWS.config.region = 'us-east-2'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: cognitoIdentityPoolId,
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: s3AudioBucketName },
})

const ACCEPT_AUDIO = 'audio/*'

const AudioFilesWrapper = styled.div`
  padding-bottom: 2rem;
`

interface TransactionAudioProps {
  transactionId: string
}

const TransactionAudio: React.FC<TransactionAudioProps> = ({ transactionId }) => {
  const [audioFiles, setAudioFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAudio(transactionId)
  }, [transactionId])

  const getAudio = (transactionId: string) => {
    setIsLoading(true)

    s3.listObjects(
      {
        Delimiter: '/',
        Bucket: s3AudioBucketName,
        Prefix: `transaction-id-${transactionId}/`,
      },
      function (err, data) {
        if (err) {
          console.error(err)
        } else {
          if (!data || !data.Contents) return []

          const audioFiles = data.Contents.map((file) => {
            if (!file.Key) throw new Error()

            return {
              fileName: file.Key,
              title: file.Key.split('/')[1],
            }
          })

          setAudioFiles(audioFiles)
          setIsLoading(false)
        }
      },
    )
  }

  const handleFinish = () => {
    getAudio(transactionId)
    setIsLoading(false)
  }

  const namespace = 'transaction-id-' + transactionId
  const tags = `daysUntilExpiration=30`

  return (
    <div
      css={css`
        position: relative;
        margin-bottom: 2rem;
      `}
    >
      {isLoading && <LoadingSpinner />}

      <h2 style={{ marginBottom: 0 }}>Audio</h2>
      <p style={{ fontSize: '14px', marginTop: 0 }}>Audio files will expire after 30 days</p>

      <AudioFilesWrapper>
        {!!audioFiles.length && <Audio audio={audioFiles} />}
      </AudioFilesWrapper>

      <h3 style={{ marginTop: 0 }}>Add audio</h3>

      {error && (
        <div
          css={css`
            color: red;
            font-size: 15px;
            margin-bottom: 1rem;
          `}
        >
          {error}
        </div>
      )}

      <ReactS3Uploader
        signingUrl={s3UrlSigningUrl}
        signingUrlQueryParams={{
          // @ts-ignore
          bucketName: s3AudioBucketName,
          namespace,
        }}
        signingUrlMethod="GET"
        accept={ACCEPT_AUDIO}
        onProgress={() => {
          setIsLoading(true)
        }}
        onError={(err) => {
          setError('There was an error')
        }}
        onFinish={() => {
          handleFinish()
        }}
        uploadRequestHeaders={{ 'x-amz-acl': 'public-read', 'x-amz-tagging': tags }}
        contentDisposition="auto"
        scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, '')}
        server={s3UrlSigningServer}
        autoUpload={true}
        // onSignedUrl={() => {}}
        // preprocess={(thing)=> console.log({thing})}
        // inputRef={}
      />
    </div>
  )
}

export { TransactionAudio }
