import React from 'react'
import { ListingAttributes } from '../../types'
import { startCase } from 'lodash'
import { Prices } from '../../organisms'
import { Audio } from '../../organisms/Audio'

interface ListingProps {
  listingAttributes: ListingAttributes
}

const Listing: React.FC<ListingProps> = ({ listingAttributes }) => {
  const publicData = listingAttributes.publicData

  if (!publicData) return null

  const {
    audio,
    averageTurnaroundTime,
    experience,
    explainMore,
    prices,
    primaryGenres,
    serviceType,
    whyAreYouTheRightFit,
  } = publicData

  return (
    <section>
      <h2>Service type</h2>
      <div>{startCase(serviceType)}</div>

      <h2>Prices</h2>
      <Prices prices={prices} />

      <h2>Why are you the right fit?</h2>
      <div>{whyAreYouTheRightFit}</div>

      <h2>Primary genres</h2>
      <div>{primaryGenres}</div>

      <h2>Experience</h2>
      <div>{experience}</div>

      <h2>Average turnaround time</h2>
      <div>{averageTurnaroundTime}</div>

      <h2>Explain more</h2>
      <div>{explainMore}</div>

      <h2>Audio</h2>
      <Audio audio={audio} />
    </section>
  )
}

export { Listing }
