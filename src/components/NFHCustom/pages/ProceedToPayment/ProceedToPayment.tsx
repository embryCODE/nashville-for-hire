import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
import pricingOptions from '../../../../util/pricingOptions'
import { LineItemsDisplay } from '../../organisms/LineItemsDisplay'

const ProceedToPaymentWrapper = styled.div`
  padding: 0 1rem 1rem;
`

interface ProceedToPaymentProps {
  isCustomer: boolean
  lineItems: any
  onProceedToPayment: () => void
}

const ProceedToPayment: React.FC<ProceedToPaymentProps> = ({
  isCustomer,
  lineItems,
  onProceedToPayment,
}) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    onProceedToPayment()
  }

  return (
    <ProceedToPaymentWrapper>
      <h2>Proceed to payment</h2>

      {isCustomer ? (
        <div>
          <p>Prices have been set. Proceed to payment below</p>

          <LineItemsDisplay lineItems={lineItems} />

          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <button>Proceed to payment</button>
          </form>
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
