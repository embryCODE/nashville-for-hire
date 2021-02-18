import React, { SyntheticEvent, useState } from 'react'
import styled from 'styled-components'
import { Money } from 'sharetribe-flex-sdk/src/types'
import { PrimaryButton } from '../../../Button/Button'
import getTitle from '../../../../util/getTitle'

const FinishNegotiationWrapper = styled.div`
  padding: 0 1rem 1rem;

  p {
    font-size: 16px;
    line-height: 28px;
  }
`

interface FinishNegotiationProps {
  isCustomer: boolean
  lineItems: any[]
  onFinishNegotiation: (newLineItems: any) => void
  listing: any
}

const FinishNegotiation: React.FC<FinishNegotiationProps> = ({
  isCustomer,
  lineItems,
  onFinishNegotiation,
  listing,
}) => {
  const [newLineItems, setNewLineItems] = useState(lineItems)

  if (!listing.attributes.publicData) return null

  const publicData = listing.attributes.publicData

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
      {isCustomer ? (
        <>
          <h2>Step 1</h2>
          <p>
            Send over any information you have about your project (deadline, what you need to hire,
            reference tracks, etc.), then upload any files you want to share.
          </p>
          <p>Our music pro will then confirm availability and send an invoice!</p>
        </>
      ) : (
        <>
          <h2>Step 1: Confirm service and price </h2>
          <p>
            The client has been prompted to share all needed info and files with you. Once you are
            ready to move forward, click “Send Invoice” to confirm the below price points.
          </p>

          <form onSubmit={handleSubmit}>
            {newLineItems.map((li: any) => (
              <div key={li.code} style={{ marginBottom: '1rem' }}>
                <label htmlFor={li.code}>{getTitle(li.code, publicData)}</label>
                <input
                  id={li.code}
                  value={li.unitPrice.amount / 100 || ''}
                  onChange={handleChange(li.code)}
                />
              </div>
            ))}

            <PrimaryButton
              disabled={isDisabled}
              style={{ marginTop: '2rem', backgroundColor: '#5d576d' }}
            >
              Send Invoice
            </PrimaryButton>
          </form>
        </>
      )}
    </FinishNegotiationWrapper>
  )
}

export { FinishNegotiation }
