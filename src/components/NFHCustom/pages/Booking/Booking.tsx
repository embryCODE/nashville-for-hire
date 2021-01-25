import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
import { Price } from '../../types'
import { PriceItemSelector } from './PriceItemSelector'

const BookingWrapper = styled.div`
  width: 100%;
`

interface BookingProps {
  sellerName: string
  prices: Record<string, Price>
}

const Booking: React.FC<BookingProps> = ({ sellerName, prices }) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    console.log('Submitted')
  }

  return (
    <BookingWrapper>
      <h2>Hire {sellerName}</h2>
      <form onSubmit={handleSubmit}>
        {Object.values(prices).map((price) => {
          return <PriceItemSelector price={price} />
        })}
        <button>Hire!</button>
      </form>
    </BookingWrapper>
  )
}

export { Booking }
