import React, { SyntheticEvent, useState } from 'react'
import styled from 'styled-components'
import pricingOptions from '../../../../util/pricingOptions'
import { Money } from 'sharetribe-flex-sdk/src/types'
import { PrimaryButton } from '../../../Button/Button'

const FinishNegotiationWrapper = styled.div`
  padding: 0 1rem 1rem;
`

const unnestedPricingOptions = Object.values(pricingOptions)
  .flat()
  .map((po) => Object.values(po).flat())
  .flat()

const getLabel = (code: string): string => {
  return unnestedPricingOptions.find((po) => code.includes(po.code)).label
}

interface FinishNegotiationProps {
  isCustomer: boolean
  lineItems: any[]
  onFinishNegotiation: (newLineItems: any) => void
}

const FinishNegotiation: React.FC<FinishNegotiationProps> = ({
  isCustomer,
  lineItems,
  onFinishNegotiation,
}) => {
  const [newLineItems, setNewLineItems] = useState(lineItems)

  const handleChange = (code: string) => (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      value: string
    }

    setNewLineItems((prev: any) => {
      return prev.map((li: any) => {
        return li.code === code
          ? {
              ...li,
              unitPrice: new Money(parseInt(target.value) * 100, li.unitPrice.currency),
            }
          : li
      })
    })
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onFinishNegotiation(newLineItems)
  }

  const isDisabled = !newLineItems.every((li) => li.unitPrice.amount > 0)

  return (
    <FinishNegotiationWrapper>
      <h2>Negotiation</h2>
      {isCustomer ? (
        <>
          <p>
            Discuss prices with the seller. Once in agreement, the seller will set the prices and
            you can continue to payment.
          </p>
        </>
      ) : (
        <>
          <p>Communicate with the buyer then submit the agreed upon prices below</p>

          <form onSubmit={handleSubmit}>
            {newLineItems.map((li: any) => (
              <div key={li.code} style={{ marginBottom: '1rem' }}>
                <label htmlFor={li.code}>{getLabel(li.code)}</label>
                <input
                  id={li.code}
                  value={li.unitPrice.amount / 100 || ''}
                  onChange={handleChange(li.code)}
                />
              </div>
            ))}

            <PrimaryButton disabled={isDisabled}>Submit</PrimaryButton>
          </form>
        </>
      )}
    </FinishNegotiationWrapper>
  )
}

export { FinishNegotiation }
