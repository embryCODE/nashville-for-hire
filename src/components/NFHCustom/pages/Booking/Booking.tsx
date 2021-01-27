import React, { SyntheticEvent, useState } from 'react'
import styled from 'styled-components'
import { Price, PriceWithQuantity } from '../../types'
import { PriceItemSelector } from './PriceItemSelector'

const BookingWrapper = styled.div`
  width: 100%;
`

interface BookingProps {
  sellerName: string
  prices: Record<string, Price>
  onSubmit: (data: Record<string, PriceWithQuantity>) => void
}

const Booking: React.FC<BookingProps> = ({ sellerName, prices, onSubmit }) => {
  const pricesWithQuantity = Object.entries(prices).reduce<Record<string, PriceWithQuantity>>(
    (acc, [currKey, currPrice]) => {
      acc[currKey] = { ...currPrice, quantity: 0 }

      return acc
    },
    {},
  )
  const [quantities, setQuantities] = useState(pricesWithQuantity)

  const handleQuantityChange = (key: string) => (quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        quantity,
      },
    }))
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit(quantities)
  }

  return (
    <BookingWrapper>
      <h2>Hire {sellerName}</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(quantities).map(([key, price]) => {
          const currentPriceWithQuantity = quantities[key]

          return (
            <PriceItemSelector
              key={key}
              price={price}
              quantity={currentPriceWithQuantity.quantity}
              onQuantityChange={handleQuantityChange(key)}
            />
          )
        })}
        <button>Hire!</button>
      </form>
    </BookingWrapper>
  )
}

export { Booking }
