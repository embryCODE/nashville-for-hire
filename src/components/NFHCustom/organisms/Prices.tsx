import React from 'react'
import { Price as PriceType, PriceData } from '../types'
import styled from 'styled-components'
import { sortByPriceCode } from '../../../util/sortFunctions'

const PriceCard = styled.div`
  background-color: #5d576d;
  color: white;
  padding: 12px;
  margin-bottom: 1rem;
  border-radius: 8px;

  h2 {
    margin: 0;
    font-size: 28px;
    font-family: Georgia, serif;
  }

  p {
    margin: 0.5rem 0;
  }

  div {
    font-size: 15px;
    font-weight: bold;
  }
`

const PriceCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const formatPrice = (pd: PriceData): string => {
  return pd !== null ? `$${pd.amount / 100}` : ''
}

export type PricesType = Record<string, PriceType>

interface PriceProps {
  prices: PricesType
}

const Prices: React.FC<PriceProps> = ({ prices }) => {
  return (
    <div>
      {Object.values(prices)
        .sort(sortByPriceCode)
        .map((price) => (
          <PriceCard key={price.code}>
            <PriceCardHeader>
              <h2>{price.title}</h2>
              <div style={{ flex: 0, whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                {price.shouldContactForPrice ? 'Contact for Pricing' : formatPrice(price.price)}
              </div>
            </PriceCardHeader>

            <p>{price.description}</p>
          </PriceCard>
        ))}
    </div>
  )
}

export { Prices }
