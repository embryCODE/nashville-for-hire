import React from 'react'
import styled from 'styled-components/macro'
import { Constrainer } from '../../layout'
import { InstrumentTiles } from '../../organisms'
import nfhMarketplaceLogo from '../../../../assets/images/nfh-marketplace-logo.png'

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

const NfhMarketplaceImg = styled.img`
  display: inline-block;
  max-width: 100%;
  width: 500px;
  height: 78.125px;
  margin: 3rem 0 0 -2rem;

  @media (min-width: 1000px) {
    margin-bottom: -2rem;
  }
`

export const Landing: React.FC = () => {
  return (
    <div css={{ backgroundColor: '#f9f4ee' }}>
      <Constrainer>
        <NfhMarketplaceImg src={nfhMarketplaceLogo} alt="Nashville For Hire Marketplace" />

        <WhatDoesYourProjectNeed>What does your project need?</WhatDoesYourProjectNeed>

        <InstrumentTiles />
      </Constrainer>
    </div>
  )
}
