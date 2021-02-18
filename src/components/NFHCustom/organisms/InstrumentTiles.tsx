import React from 'react'
import styled from 'styled-components'
import acousticGuitar from '../../../assets/images/instrumentIcons/acousticGuitar.png'
import bass from '../../../assets/images/instrumentIcons/bass.png'
import brass from '../../../assets/images/instrumentIcons/brass.png'
import drums from '../../../assets/images/instrumentIcons/drums.png'
import electricGuitar from '../../../assets/images/instrumentIcons/electricGuitar.png'
import femaleVocals from '../../../assets/images/instrumentIcons/femaleVocals.png'
import keys from '../../../assets/images/instrumentIcons/keys.png'
import maleVocals from '../../../assets/images/instrumentIcons/maleVocals.png'
import mastering from '../../../assets/images/instrumentIcons/mastering.png'
import mixing from '../../../assets/images/instrumentIcons/mixing.png'
import organ from '../../../assets/images/instrumentIcons/organ.png'
import piano from '../../../assets/images/instrumentIcons/piano.png'
import produce from '../../../assets/images/instrumentIcons/produce.png'
import programming from '../../../assets/images/instrumentIcons/programming.png'
import songwriting from '../../../assets/images/instrumentIcons/songwriting.png'
import strings from '../../../assets/images/instrumentIcons/strings.png'
import synth from '../../../assets/images/instrumentIcons/synth.png'
import topline from '../../../assets/images/instrumentIcons/topline.png'
import utility from '../../../assets/images/instrumentIcons/utility.png'
import { createResourceLocatorString } from '../../../util/routes'
import routeConfiguration from '../../../routeConfiguration'
import { Link } from 'react-router-dom'

const InstrumentTilesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -16px 3rem;

  div {
    margin: 24px 16px;
  }

  img {
    border-radius: 10px;
    width: 200px;
    height: 200px;
  }

  @media (max-width: 600px) {
    margin: 0 -8px 3rem;

    img {
      border-radius: 10px;
      margin: 16px 8px;
      width: 150px;
      height: 150px;
    }
  }
`

const images = [
  { alt: 'Female vocals', src: femaleVocals, key: 'femaleVocals' },
  { alt: 'Male vocals', src: maleVocals, key: 'maleVocals' },
  { alt: 'Songwriting', src: songwriting, key: 'songwriting' },
  { alt: 'Topline', src: topline, key: 'topline' },
  { alt: 'Acoustic guitar', src: acousticGuitar, key: 'acousticGuitar' },
  { alt: 'Electric guitar', src: electricGuitar, key: 'electricGuitar' },
  { alt: 'Bass', src: bass, key: 'bass' },
  { alt: 'Drums', src: drums, key: 'drums' },
  { alt: 'Piano', src: piano, key: 'piano' },
  { alt: 'Keys', src: keys, key: 'keys' },
  { alt: 'Synth', src: synth, key: 'synth' },
  { alt: 'Organ', src: organ, key: 'organ' },
  { alt: 'Programming', src: programming, key: 'programming' },
  { alt: 'Strings', src: strings, key: 'strings' },
  { alt: 'Utility', src: utility, key: 'utility' },
  { alt: 'Brass', src: brass, key: 'brass' },
  { alt: 'Mixing', src: mixing, key: 'mixing' },
  { alt: 'Mastering', src: mastering, key: 'mastering' },
  { alt: 'Produce your entire song', src: produce, key: 'produce' },
]

export const InstrumentTiles: React.FC = () => {
  return (
    <InstrumentTilesContainer>
      {images.map(({ alt, src, key }) => {
        const pathname = createResourceLocatorString('SearchPage', routeConfiguration(), {}, {})
        const search = `pub_serviceType=${key}`

        return (
          <div key={key}>
            <Link to={{ pathname, search }}>
              <img key={src} alt={alt} src={src} />
            </Link>
          </div>
        )
      })}
    </InstrumentTilesContainer>
  )
}
