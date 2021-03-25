import React, { useEffect, useState } from 'react'
import {
  s3UrlSigningServer,
  s3UrlSigningUrl,
  cognitoIdentityPoolId,
  s3FilesBucketName,
} from '../../../config'
import ReactS3Uploader from 'react-s3-uploader'
import AWS from 'aws-sdk'
import { css } from 'styled-components/macro'
import { LoadingSpinner } from '../molecules/LoadingSpinner'
import { Files } from './Files'

AWS.config.region = 'us-east-2'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: cognitoIdentityPoolId,
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: s3FilesBucketName },
})

const ACCEPT_FILES = '*'

interface TransactionFilesProps {
  transactionId: string
}

const TransactionFiles: React.FC<TransactionFilesProps> = ({ transactionId }) => {
  const [files, setFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getFiles(transactionId)
  }, [transactionId])

  const getFiles = (transactionId: string) => {
    setIsLoading(true)

    s3.listObjects(
      {
        Delimiter: '/',
        Bucket: s3FilesBucketName,
        Prefix: `transaction-id-${transactionId}/`,
      },
      function (err, data) {
        if (err) {
          console.error(err)
        } else {
          if (!data || !data.Contents) return []

          const files = data.Contents.map((file) => {
            if (!file.Key) throw new Error()

            return {
              fileName: file.Key,
              title: file.Key.split('/')[1],
            }
          })

          setFiles(files)
          setIsLoading(false)
        }
      },
    )
  }

  const handleFinish = () => {
    getFiles(transactionId)
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

      <h2 style={{ marginBottom: 0 }}>Files</h2>
      <p style={{ fontSize: '14px', marginTop: 0 }}>Files will expire after 30 days</p>

      <div>{!!files.length && <Files files={files} allowDownload={true} />}</div>

      <h3 style={{ marginTop: '2rem' }}>Add file</h3>

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
          bucketName: s3FilesBucketName,
          namespace,
        }}
        signingUrlMethod="GET"
        accept={ACCEPT_FILES}
        onProgress={() => {
          setIsLoading(true)
        }}
        onError={() => {
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

export { TransactionFiles }
