import React from 'react'
import { File as FileType } from '../types'
import { cognitoIdentityPoolId, s3FilesBucketName } from '../../../config'
import styled from 'styled-components'
import UnstyledButton from '../atoms/UnstyledButton'
import AWS from 'aws-sdk'
import Icon from '@mdi/react'
import { mdiDownload } from '@mdi/js'

const Card = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;

  display: flex;
  align-items: flex-start;
`

const FileNameDiv = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
`

AWS.config.region = 'us-east-2'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: cognitoIdentityPoolId,
})

const getFileName = (files: FileType) => {
  return files.fileName.split('/')[1]
}

interface FilesProps {
  files: FileType[]
  allowDownload?: boolean
}

const Files: React.FC<FilesProps> = ({ files }) => {
  const handleDownload = (file: FileType) => () => {
    const s3 = new AWS.S3({ params: { Bucket: s3FilesBucketName } })
    const getParams = { Bucket: s3FilesBucketName, Key: file.fileName }
    const fileNameDisplay = file.fileName.split('/')[1]

    s3.getObject(getParams, (err, data) => {
      const blob = new Blob([data.Body as BlobPart], { type: data.ContentType })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileNameDisplay
      link.click()
    })
  }

  return (
    <div>
      {files.map((file) => (
        <Card key={file.fileName}>
          <FileNameDiv>{getFileName(file)}</FileNameDiv>

          <UnstyledButton
            onClick={handleDownload(file)}
            style={{ marginLeft: '12px', flex: 0, minWidth: 24 }}
          >
            <Icon path={mdiDownload} size={1} color="#5d576d" />
          </UnstyledButton>
        </Card>
      ))}
    </div>
  )
}

export { Files }
