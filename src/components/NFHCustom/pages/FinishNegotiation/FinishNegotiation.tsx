import React, { SyntheticEvent, Fragment, useState } from 'react'
import styled from 'styled-components'
import pricingOptions from '../../../../util/pricingOptions'
import { Money } from 'sharetribe-flex-sdk/src/types'

// TODO: Clean this mess up

const FinishNegotiationWrapper = styled.div`
  padding: 1rem;
`

const hydrateLineItems = (lineItems: any) => {
  return lineItems.map((li: any) => {
    const unnestedPricingOptions = Object.values(pricingOptions)
      .flat()
      .map((po) => Object.values(po).flat())
      .flat()

    const foundPricingOption = unnestedPricingOptions.find((po) => {
      return li.code.includes(po.code)
    })

    return { ...li, ...foundPricingOption }
  })
}

interface FinishNegotiationProps {
  lineItems: any[]
  onFinishNegotiation: () => void
}

const FinishNegotiation: React.FC<FinishNegotiationProps> = ({
  lineItems,
  onFinishNegotiation,
}) => {
  const [hydratedLineItems, setHydratedLineItems] = useState(hydrateLineItems(lineItems))

  const handleChange = (code: string) => (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      value: string
    }

    setHydratedLineItems((prev: any) => {
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
    onFinishNegotiation()
  }

  return (
    <FinishNegotiationWrapper>
      <h2>Negotiation</h2>
      <p>Communicate with the buyer then submit the agreed upon prices below</p>
      <form onSubmit={handleSubmit}>
        {hydratedLineItems.map((li: any) => (
          <Fragment key={li.code}>
            <label htmlFor={li.code}>{li.label}</label>
            <input
              id={li.code}
              value={li.unitPrice.amount / 100 || 0}
              onChange={handleChange(li.code)}
            />
          </Fragment>
        ))}
        <button>Submit</button>
      </form>
    </FinishNegotiationWrapper>
  )
}

export { FinishNegotiation }
