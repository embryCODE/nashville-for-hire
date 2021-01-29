import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
import { Price } from '../../types'

const FinishNegotiationWrapper = styled.div`
  padding: 1rem;
`

interface FinishNegotiationProps {
  prices: Record<string, Price>
  onFinishNegotiation: () => void
}

const FinishNegotiation: React.FC<FinishNegotiationProps> = ({ prices, onFinishNegotiation }) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onFinishNegotiation()
  }

  return (
    <FinishNegotiationWrapper>
      <h2>Negotiation</h2>
      <p>Communicate with the buyer then submit the agreed upon prices below</p>
      <form onSubmit={handleSubmit}>
        <button>Submit</button>
      </form>

      <pre>{JSON.stringify(prices, null, 2)}</pre>
    </FinishNegotiationWrapper>
  )
}

export { FinishNegotiation }
