import React from 'react'
import { Audio as AudioType } from '../types'
import audioCss from './Audio.scss'

interface AudioProps {
  audio: AudioType[]
}

const Audio: React.FC<AudioProps> = ({ audio }) => {
  return (
    <table className={audioCss.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>File name</th>
        </tr>
      </thead>

      <tbody>
        {audio.map((audio) => (
          <tr>
            <td>{audio.title}</td>
            <td>{audio.fileName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { Audio }
