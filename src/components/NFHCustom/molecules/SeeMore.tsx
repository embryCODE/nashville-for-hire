import React, { useState } from 'react'
import UnstyledButton from '../atoms/UnstyledButton'
import styled from 'styled-components'

const CollapsibleDiv = styled.div<{ isCollapsed: boolean }>`
  position: relative;
  max-height: ${({ isCollapsed }) => (isCollapsed ? '100px' : 'unset')};
  overflow: hidden;
  text-overflow: ellipsis;
`

const GradientMask = styled.div<{ isCollapsed: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ isCollapsed }) =>
    isCollapsed ? 'linear-gradient(transparent, rgba(249, 244, 238, 1)) bottom;' : 'unset'};
`

const SeeMore: React.FC = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleCollapsed = () => {
    setIsCollapsed((prevState) => !prevState)
  }

  return (
    <div>
      <CollapsibleDiv isCollapsed={isCollapsed}>
        <GradientMask isCollapsed={isCollapsed} />
        {children}
      </CollapsibleDiv>

      <UnstyledButton onClick={toggleCollapsed} style={{ color: '#dd9972' }}>
        {isCollapsed ? 'See more' : 'See less'}
      </UnstyledButton>
    </div>
  )
}

export { SeeMore }
