import React from 'react'
import { Price as PriceType } from '../types'
import pricingCss from './Pricing.scss'

interface PriceProps {
  prices: Record<string, PriceType>
}

const Prices: React.FC<PriceProps> = ({ prices }) => {
  return (
    <table className={pricingCss.table}>
      <thead>
        <tr>
          <th>Service</th>
          <th>Price</th>
        </tr>
      </thead>

      <tbody>
        {Object.values(prices).map((price) => (
          <tr key={price.label}>
            <td>{price.label}</td>
            <td>
              {price.shouldContactForPrice
                ? 'Contact for price'
                : `$${(price.price.amount / 100).toFixed(2)}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { Prices }
