import React, { SyntheticEvent, useState } from 'react'
import styled from 'styled-components'
import { Price, PriceWithQuantity } from '../../types'
import { PriceItemSelector } from './PriceItemSelector'
import { PrimaryButton } from '../../../Button/Button'

const BookingWrapper = styled.div`
  width: 100%;
`

const LoginHint = styled.p`
  font-size: 14px;
  color: red;
`

const createInitialPricesAndQuantity = (prices: Record<string, Price>) => {
  return Object.entries(prices).reduce<Record<string, PriceWithQuantity>>(
    (acc, [currKey, currPrice]) => {
      acc[currKey] = { ...currPrice, quantity: 0 }

      return acc
    },
    {},
  )
}

interface BookingProps {
  sellerName: string
  prices: Record<string, Price>
  onSubmit: (data: Record<string, PriceWithQuantity>) => void
  isDisabled?: boolean
}

const Booking: React.FC<BookingProps> = ({ sellerName, prices, onSubmit, isDisabled }) => {
  const [pricesAndQuantity, setPricesAndQuantity] = useState(createInitialPricesAndQuantity(prices))

  const handleQuantityChange = (key: string) => (quantity: number) => {
    setPricesAndQuantity((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        quantity,
      },
    }))
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    const pricesAndQuantityWithoutEmpties = Object.entries(pricesAndQuantity).reduce<
      typeof pricesAndQuantity
    >((acc, [currKey, currVal]) => {
      if (currVal.quantity === 0) return acc

      acc[currKey] = currVal

      return acc
    }, {})

    onSubmit(pricesAndQuantityWithoutEmpties)
  }

  return (
    <BookingWrapper>
      <h2>Hire {sellerName}</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(pricesAndQuantity).map(([key, price]) => {
          const currentPriceWithQuantity = pricesAndQuantity[key]

          return (
            <PriceItemSelector
              key={key}
              price={price}
              quantity={currentPriceWithQuantity.quantity}
              onQuantityChange={handleQuantityChange(key)}
            />
          )
        })}

        {isDisabled && <LoginHint>Must sign up or login to hire</LoginHint>}

        <PrimaryButton disabled={isDisabled}>Hire!</PrimaryButton>
      </form>
    </BookingWrapper>
  )
}

export { Booking }
