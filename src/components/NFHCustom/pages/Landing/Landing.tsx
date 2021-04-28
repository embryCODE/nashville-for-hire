import React from 'react'
import styled from 'styled-components/macro'
import { Constrainer } from '../../layout'
import guitarOnBed from '../../../../assets/images/guitarOnBed.jpg'
import { InstrumentTiles, Testimonials, TestimonialVideo } from '../../organisms'
import ScrollAnimation from 'react-animate-on-scroll'

const WhatDoesYourProjectNeed = styled.h2`
  font-family: Source Sans Pro, sans-serif;
  font-size: 36px;
  text-align: right;
  width: 1100px;
  max-width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;

  @media (max-width: 600px) {
    text-align: left;
    padding: 0;
  }
`

const TestimonialsHero = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;

  h2 {
    margin-left: 6rem;
    font-family: Source Sans Pro, sans-serif;
    font-size: 36px;
  }

  @media (max-width: 600px) {
    flex-direction: column;

    div {
      display: none;
    }

    h2 {
      margin-left: 0;
    }
  }
`

const BackgroundColorDiv = styled.div`
  background-color: #ac7163;
  width: auto;
  max-width: 400px;
  padding: 2rem 0;

  img {
    position: relative;
    right: -3rem;
    max-width: 400px;
  }
`

export const Landing: React.FC = () => {
  return (
    <div css={{ backgroundColor: '#f9f4ee' }}>
      <Constrainer>
        <WhatDoesYourProjectNeed>What does your project need?</WhatDoesYourProjectNeed>

        <InstrumentTiles />

        <TestimonialsHero>
          <ScrollAnimation animateIn="fadeInLeft">
            <BackgroundColorDiv>
              <img alt="A person playing guitar" src={guitarOnBed} />
            </BackgroundColorDiv>
          </ScrollAnimation>

          <ScrollAnimation animateIn="fadeInDown">
            <h2>What are our clients saying about us?</h2>
          </ScrollAnimation>
        </TestimonialsHero>

        <Testimonials />

        <TestimonialVideo />
      </Constrainer>
    </div>
  )
}
