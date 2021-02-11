import React, { useEffect, useState } from 'react'
import {
  s3UrlSigningServer,
  s3UrlSigningUrl,
  s3AudioBucket,
  cognitoIdentityPoolId,
  s3AudioBucketName,
} from '../../../config'
import ReactS3Uploader from 'react-s3-uploader'
import AWS from 'aws-sdk'
import styled from 'styled-components'

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

  useEffect(() => {
    getAudio(transactionId)
  }, [transactionId])

  const getAudio = (transactionId: string) => {
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
              key: file.Key,
              name: file.Key.split('/')[1],
            }
          })

          setAudioFiles(audioFiles)
        }
      },
    )
  }

  const buildSrc = (key: string) => {
    return `${s3AudioBucket}/${key}`
  }

  const handleFinish = () => {
    getAudio(transactionId)
  }

  return (
    <div>
      <h2>Audio</h2>
      <p style={{ fontSize: '14px' }}>Audio files will expire after 30 days</p>

      <AudioFilesWrapper>
        {audioFiles.map(({ key, name }) => {
          const src = buildSrc(key)

          return (
            <div key={key}>
              <h3>{name}</h3>
              <audio src={src} controls />
            </div>
          )
        })}
      </AudioFilesWrapper>

      <h3 style={{ marginTop: 0 }}>Add audio</h3>

      <ReactS3Uploader
        signingUrl={s3UrlSigningUrl}
        signingUrlQueryParams={{
          // @ts-ignore
          bucketName: s3AudioBucketName,
          namespace: 'transaction-id-' + transactionId,
        }}
        signingUrlMethod="GET"
        accept={ACCEPT_AUDIO}
        onSignedUrl={(res) => {
          console.log('onSignedUrl', res)
        }}
        onProgress={(value) => {
          console.log('onProgress', value)
        }}
        onError={(err) => {
          console.error({ onError: err })
        }}
        onFinish={() => {
          console.log('onFinish')
          handleFinish()
        }}
        uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
        contentDisposition="auto"
        scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, '')}
        server={s3UrlSigningServer}
        autoUpload={true}
        // preprocess={(thing)=> console.log({thing})}
        // inputRef={}
      />
    </div>
  )
}

export { TransactionAudio }
