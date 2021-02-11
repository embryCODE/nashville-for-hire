import React, { Fragment } from 'react'
import { Audio as AudioType } from '../types'
import audioCss from './Audio.scss'
import { s3AudioBucket } from '../../../config'

interface AudioProps {
  audio: AudioType[]
}

const Audio: React.FC<AudioProps> = ({ audio }) => {
  return (
    <div className={audioCss.audioWrapper}>
      {audio.map((audio) => (
        <Fragment key={audio.fileName}>
          <div>{audio.fileName.split('/')[1]}</div>
          <audio controls src={`${s3AudioBucket}/${audio.fileName}`} key={audio.fileName} />
        </Fragment>
      ))}
    </div>
  )
}

export { Audio }
