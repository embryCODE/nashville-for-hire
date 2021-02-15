import React from 'react'
import { ListingAttributes } from '../types'
import styled, { css } from 'styled-components/macro'

const Card = styled.div`
  background: #fff;
  border-radius: 4px;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  width: 100%;
  padding: 1rem;

  h2,
  p {
    margin: 0;
  }

  p {
    margin-top: 0.5rem;
  }
`

interface AboutProps {
  listingAttributes: ListingAttributes
  sellerName: string
}

const About: React.FC<AboutProps> = ({ listingAttributes, sellerName }) => {
  const {
    primaryGenres,
    averageTurnaroundTime,
    whyAreYouTheRightFit,
    experience,
    explainMore,
  } = listingAttributes.publicData

  return (
    <div>
      <h2
        css={css`
          font-size: 32px;
          margin-top: 0;
        `}
      >
        About {sellerName}
      </h2>

      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 1rem 0;

          @media (min-width: 768px) {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        `}
      >
        <div>
          <h3
            css={css`
              margin-top: 0;
            `}
          >
            Turnaround time
          </h3>
          <p>{averageTurnaroundTime}</p>

          <h3>Why is {sellerName} the right fit?</h3>
          <p>{whyAreYouTheRightFit}</p>

          <h3>More details</h3>
          <p>{explainMore}</p>
        </div>

        <div
          css={css`
            flex: 1;
          `}
        >
          <Card>
            <h2>Genres</h2>
            <p>{primaryGenres}</p>
          </Card>

          <Card
            css={css`
              margin-top: 1rem;
            `}
          >
            <h2>Experience</h2>
            <p>{experience}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { About }
