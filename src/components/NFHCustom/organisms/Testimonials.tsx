import React from 'react'
import styled from 'styled-components'
import { Testimonial } from '../molecules/Testimonial'

const TestimonialsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -16px 3rem;
`

export const Testimonials: React.FC = () => {
  return (
    <TestimonialsContainer>
      <Testimonial name="aratus">
        "The Nashville For Hire session singers really{' '}
        <strong>came through when others didn’t.</strong> I needed professional radio-ready vocals
        for my Pop Demos and the talent here is great. <strong>I highly recommend NFH</strong>."
      </Testimonial>

      <Testimonial name="phil d.">
        <strong>To say I was pleased is an understatement.</strong> NFH has become my first stop
        when I need talent. Their artists are top drawer and their pricing is quite reasonable.{' '}
        <strong>I recommend NFH without reservations.</strong>"
      </Testimonial>
    </TestimonialsContainer>
  )
}
