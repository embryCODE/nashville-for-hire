import React from 'react'
import styled from 'styled-components'

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
          <h2>Complete Order</h2>
          <button onClick={onCompleteOrder}>Complete order</button>
        </>
      )}
    </CompleteOrderWrapper>
  )
}

export { CompleteOrder }
