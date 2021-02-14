import React from 'react'
import { ListingAttributes } from '../../types'
import { startCase } from 'lodash'
import { Audio } from '../../organisms/Audio'
import { css } from 'styled-components/macro'

interface ListingProps {
  listingAttributes: ListingAttributes
  sellerName: string
}

const Listing: React.FC<ListingProps> = ({ listingAttributes, sellerName }) => {
  const { title, publicData } = listingAttributes

  if (!publicData) return null

  const {
    audio,
    averageTurnaroundTime,
    experience,
    explainMore,
    prices,
    primaryGenres,
    whyAreYouTheRightFit,
  } = publicData

  return (
    <section>
      <h1 style={{ margin: 0 }}>{startCase(title)}</h1>
      <div>by {sellerName}</div>

      <div
        css={css`
          margin: 2rem 0;
        `}
      >
        <Audio audio={audio} />
      </div>

      <h2>About {sellerName}</h2>

      <h3>Primary genres</h3>
      <p>{primaryGenres}</p>

      <h3>Average turnaround time</h3>
      <p>{averageTurnaroundTime}</p>

      <h3>Why are you the right fit?</h3>
      <p>{whyAreYouTheRightFit}</p>

      <h3>Experience</h3>
      <p>{experience}</p>

      <h3>Explain more</h3>
      <p>{explainMore}</p>
    </section>
  )
}

export { Listing }
