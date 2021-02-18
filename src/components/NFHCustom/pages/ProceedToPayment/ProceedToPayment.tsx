import React from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../../../Button/Button'

const ProceedToPaymentWrapper = styled.div`
  padding: 0 1rem 2rem;

  p {
    margin: 0 0 2rem;
    font-size: 16px;
    line-height: 28px;
  }
`

interface ProceedToPaymentProps {
  isCustomer: boolean
  onProceedToPayment: () => void
}

const ProceedToPayment: React.FC<ProceedToPaymentProps> = ({ isCustomer, onProceedToPayment }) => {
  return (
    <ProceedToPaymentWrapper>
      {isCustomer ? (
        <div>
          <p>
            Get your order started by completing your payment below. Our music pro will then accept
            your payment and get to work!
          </p>

          <PrimaryButton onClick={onProceedToPayment} style={{ backgroundColor: '#5d576d' }}>
            Proceed to Payment
          </PrimaryButton>
        </div>
      ) : (
        <div>
          <p>Invoice is sent. Waiting for client to set up payment.</p>
        </div>
      )}
    </ProceedToPaymentWrapper>
  )
}

export { ProceedToPayment }
