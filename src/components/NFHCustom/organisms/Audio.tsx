import React, { useEffect, useRef, useState } from 'react'
import { Audio as AudioType } from '../types'
import { cognitoIdentityPoolId, s3AudioBucket, s3AudioBucketName } from '../../../config'
import styled from 'styled-components'
import play from '../../../assets/images/play.svg'
import pause from '../../../assets/images/pause.svg'
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
`

AWS.config.region = 'us-east-2'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: cognitoIdentityPoolId,
})

const getFileName = (audio: AudioType) => {
  return audio.fileName.split('/')[1]
}

interface AudioProps {
  audio: AudioType[]
  allowDownload?: boolean
}

const Audio: React.FC<AudioProps> = ({ audio }) => {
  const [selectedAudio, setSelectedAudio] = useState(audio[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioSrc = `${s3AudioBucket}/${selectedAudio.fileName}`

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = handlePlay
      audioRef.current.onpause = handlePause
    }
  }, [])

  const handlePlay = async () => {
    if (!audioRef.current) return

    if (audioRef.current.readyState === 4) {
      await audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current.oncanplay = async () => {
        if (!audioRef.current) return

        await audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handlePause = async () => {
    if (!audioRef.current) return
    await audioRef.current.pause()
    setIsPlaying(false)
  }

  const handleClick = (audio: AudioType) => () => {
    if (!audioRef.current) return

    const wasSelectedAudioClicked = audio.fileName === selectedAudio.fileName

    if (wasSelectedAudioClicked) {
      isPlaying ? handlePause() : handlePlay()
    } else {
      setSelectedAudio(audio)
      // Gotta give the browser time to change the audioRef.current for the new src being loaded.
      // Then the handlePlay function can do its job correctly.
      setTimeout(handlePlay, 100)
    }
  }

  const chooseIcon = (audio: AudioType) => {
    if (audio.fileName !== selectedAudio.fileName) {
      return play
    } else {
      return isPlaying ? pause : play
    }
  }

  const handleDownload = () => {
    const s3 = new AWS.S3({ params: { Bucket: s3AudioBucketName } })
    const getParams = { Bucket: s3AudioBucketName, Key: selectedAudio.fileName }
    const fileNameDisplay = selectedAudio.fileName.split('/')[1]

    s3.getObject(getParams, (err, data) => {
      const blob = new Blob([data.Body as BlobPart], { type: data.ContentType })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileNameDisplay
      link.click()
    })
  }

  return (
    <Card>
      <div>
        <div style={{ display: 'flex' }}>
          <audio
            ref={audioRef}
            controls
            src={audioSrc}
            style={{ width: '100%' }}
            controlsList="nodownload"
          />
          <UnstyledButton onClick={handleDownload} style={{ marginLeft: '4px' }}>
            <Icon path={mdiDownload} size={1} color="#5d576d" />
          </UnstyledButton>
        </div>

        <h3>{selectedAudio.name || getFileName(selectedAudio)}</h3>
        {selectedAudio.description && <p>{selectedAudio.description}</p>}
      </div>

      <hr style={{ margin: '1rem 0' }} />

      {audio.map((audio) => (
        <UnstyledButton key={audio.fileName} onClick={handleClick(audio)}>
          <img
            src={chooseIcon(audio)}
            alt="Play"
            height={32}
            width={24}
            style={{ marginRight: 4 }}
          />
          &nbsp;{audio.name || getFileName(audio)}
        </UnstyledButton>
      ))}
    </Card>
  )
}

export { Audio }
