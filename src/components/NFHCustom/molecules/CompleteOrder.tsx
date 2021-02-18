import React from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../../Button/Button'

const CompleteOrderWrapper = styled.div`
  padding: 0 1rem 1rem;

  p {
    font-size: 16px;
    line-height: 28px;
  }
`

interface CompleteOrderProps {
  isCustomer: boolean
  onCompleteOrder: () => void
}

const CompleteOrder: React.FC<CompleteOrderProps> = ({ isCustomer, onCompleteOrder }) => {
  return (
    <CompleteOrderWrapper>
      {isCustomer ? (
        <>
          <p style={{ marginTop: 0 }}>
            This project is funded and our music pro can get to work. Once the final work is
            delivered to you and you’re happy, our music pro will mark this order as completed.
          </p>
          <p style={{ fontSize: 14, fontStyle: 'italic' }}>
            <sup>*</sup>If you need any revisions at that point, you can still use this thread to
            request those.
          </p>
        </>
      ) : (
        <>
          <p style={{ marginTop: 0 }}>
            Your order is active and funded! Once you deliver your final work and no revisions are
            needed, click “Complete Order” below!
          </p>

          <p style={{ fontSize: 14, fontStyle: 'italic' }}>
            <sup>*</sup>If the client does not respond for an extended period of time AFTER
            delivering your work, feel free to mark the order as completed so that you still get
            paid.
          </p>

          <PrimaryButton onClick={onCompleteOrder} style={{ backgroundColor: ' #cd8575' }}>
            Complete Order
          </PrimaryButton>
        </>
      )}
    </CompleteOrderWrapper>
  )
}

export { CompleteOrder }
