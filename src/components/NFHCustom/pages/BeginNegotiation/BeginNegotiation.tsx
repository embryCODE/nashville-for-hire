import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'

const BeginNegotiationWrapper = styled.div`
  padding: 1rem;
`

interface BeginNegotiationProps {
  onBeginNegotiation: () => void
}

const BeginNegotiation: React.FC<BeginNegotiationProps> = ({ onBeginNegotiation }) => {
  const handleBeginNegotiation = (e: SyntheticEvent) => {
    e.preventDefault()
    onBeginNegotiation()
  }

  return (
    <BeginNegotiationWrapper>
      <div>
        <h1>Begin negotiation</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat
          mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper
          suscipit, posuere a, pede.
        </p>
        <form onSubmit={handleBeginNegotiation}>
          <button>Begin negotiation</button>
        </form>
      </div>
    </BeginNegotiationWrapper>
  )
}

export { BeginNegotiation }
