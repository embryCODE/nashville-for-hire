import React, { Fragment } from 'react'
import { Audio as AudioType } from '../types'
import audioCss from './Audio.scss'

const S3_BUCKET_PATH = 'https://nfh-nonprod-audio.s3.us-east-2.amazonaws.com/'

interface AudioProps {
  audio: AudioType[]
}

const Audio: React.FC<AudioProps> = ({ audio }) => {
  return (
    <div className={audioCss.audioWrapper}>
      {audio.map((audio) => (
        <Fragment key={audio.fileName}>
          <div>{audio.fileName.split('/')[1]}</div>
          <audio controls src={`${S3_BUCKET_PATH}${audio.fileName}`} key={audio.fileName} />
        </Fragment>
      ))}
    </div>
  )
}

export { Audio }
