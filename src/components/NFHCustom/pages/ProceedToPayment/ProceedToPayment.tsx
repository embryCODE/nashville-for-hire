import React from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../../../Button/Button'

const ProceedToPaymentWrapper = styled.div`
  padding: 0 1rem 1rem;
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
          <PrimaryButton onClick={onProceedToPayment}>Proceed to payment</PrimaryButton>
        </div>
      ) : (
        <div>
          <p>Prices are set. Awaiting customer to proceed to payment.</p>
        </div>
      )}
    </ProceedToPaymentWrapper>
  )
}

export { ProceedToPayment }
