import React from 'react'
import styled from 'styled-components/macro'
import { Constrainer } from '../../layout'
import { InstrumentTiles } from '../../organisms'

const WhatDoesYourProjectNeed = styled.h2`
  font-family: Source Sans Pro, sans-serif;
  font-size: 36px;
  text-align: right;
  width: 1100px;
  max-width: 100%;
  margin: 1rem auto 2rem;
  padding: 0 2rem;

  @media (max-width: 600px) {
    text-align: left;
    padding: 0;
  }
`

export const Landing: React.FC = () => {
  return (
    <div css={{ backgroundColor: '#f9f4ee' }}>
      <Constrainer>
        <h1 style={{ marginTop: '2rem' }}>Nashville For Hire</h1>

        <WhatDoesYourProjectNeed>What does your project need?</WhatDoesYourProjectNeed>

        <InstrumentTiles />
      </Constrainer>
    </div>
  )
}
