import React from 'react'
import { Price as PriceType, PriceData } from '../types'
import styled from 'styled-components'

const PriceCard = styled.div`
  background-color: #5d576d;
  color: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;

  h2 {
    margin: 0;
    font-size: 28px;
    font-family: Georgia, serif;
  }

  p {
    margin-top: 0.5rem;
  }

  div {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 1rem;
  }
`

const formatPrice = (pd: PriceData): string => {
  return pd !== null ? `$${pd.amount / 100}` : ''
}

interface PriceProps {
  prices: Record<string, PriceType>
}

const Prices: React.FC<PriceProps> = ({ prices }) => {
  return (
    <div>
      {Object.values(prices).map((price) => (
        <PriceCard>
          <h2>{price.title}</h2>
          <p>{price.description}</p>
          <div>
            {price.shouldContactForPrice ? 'Contact for Pricing' : formatPrice(price.price)}
          </div>
        </PriceCard>
      ))}
    </div>
  )
}

export { Prices }
