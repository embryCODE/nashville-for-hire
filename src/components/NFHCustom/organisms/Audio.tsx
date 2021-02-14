import React, { useEffect, useRef, useState } from 'react'
import { Audio as AudioType } from '../types'
import { s3AudioBucket } from '../../../config'
import styled from 'styled-components'
import play from '../../../assets/images/play.svg'

const Card = styled.div`
  background: #fff;
  border-radius: 4px;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  width: 100%;
  padding: 1rem 2rem;
`

const UnstyledButton = styled.button`
  // Remove button styling
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;

  display: block;
  margin: 4px 0;
`

const getFileName = (audio: AudioType) => {
  return audio.fileName.split('/')[1]
}

interface AudioProps {
  audio: AudioType[]
}

const Audio: React.FC<AudioProps> = ({ audio }) => {
  const [selectedAudio, setSelectedAudio] = useState(audio[0])

  const handleClick = (audio: AudioType) => () => {
    setSelectedAudio(audio)
  }

  return (
    <Card>
      <div>
        <audio
          controls
          src={`${s3AudioBucket}/${selectedAudio.fileName}`}
          key={selectedAudio.fileName}
          style={{ width: '100%' }}
          autoPlay
          controlsList="nodownload"
        />

        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>{getFileName(selectedAudio)}</div>
      </div>

      <hr style={{ margin: '1rem 0' }} />

      {audio.map((audio) => (
        <UnstyledButton key={audio.fileName} onClick={handleClick(audio)}>
          <img src={play} alt="Play" height={32} style={{ marginRight: 4 }} />
          {getFileName(audio)}
        </UnstyledButton>
      ))}
    </Card>
  )
}

export { Audio }
