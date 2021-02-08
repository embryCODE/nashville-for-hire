import React from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../../Button/Button'

const CompleteOrderWrapper = styled.div`
  padding: 0 1rem 1rem;
`

interface CompleteOrderProps {
  isCustomer: boolean
  onCompleteOrder: () => void
}

const CompleteOrder: React.FC<CompleteOrderProps> = ({ isCustomer, onCompleteOrder }) => {
  return (
    <CompleteOrderWrapper>
      {isCustomer ? (
        <p>
          Work is in progress. When work is finished, the seller will complete the order and your
          card will be charged.
        </p>
      ) : (
        <>
          <PrimaryButton onClick={onCompleteOrder}>Complete order</PrimaryButton>
        </>
      )}
    </CompleteOrderWrapper>
  )
}

export { CompleteOrder }
