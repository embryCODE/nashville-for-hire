import React from 'react'
import { ListingAttributes } from '../../types'
import { css } from 'styled-components/macro'
import { Prices } from '../../organisms'

interface ServicesProps {
  listingAttributes: ListingAttributes
}

const Services: React.FC<ServicesProps> = ({ listingAttributes }) => {
  const { publicData } = listingAttributes

  if (!publicData) return null

  const { prices } = publicData

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Services offered</h2>

      <div
        css={css`
          margin: 27px 0 0;
        `}
      >
        <Prices prices={prices} />
      </div>
    </section>
  )
}

export { Services }
