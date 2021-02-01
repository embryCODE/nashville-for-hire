import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
import pricingOptions from '../../../../util/pricingOptions'

const ProceedToPaymentWrapper = styled.div`
  padding: 0 1rem 1rem;
`

const unnestedPricingOptions = Object.values(pricingOptions)
  .flat()
  .map((po) => Object.values(po).flat())
  .flat()

const getLabel = (code: string): string => {
  return unnestedPricingOptions.find((po) => code.includes(po.code)).label
}

const renderLineItemSummary = (li: any) => {
  return (
    <span>
      ${li.unitPrice.amount / 100 || 0} x {li.quantity.toNumber()} = $
      {li.lineTotal.amount / 100 || 0}
    </span>
  )
}

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

          {Object.values(lineItems).map((li: any) => {
            return (
              <div key={li.code}>
                <h4>{getLabel(li.code)}</h4>
                {renderLineItemSummary(li)}
              </div>
            )
          })}

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
