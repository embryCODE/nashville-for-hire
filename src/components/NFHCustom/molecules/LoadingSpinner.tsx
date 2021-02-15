import React from 'react'
import { IconSpinner } from '../../index'
import { css } from 'styled-components/macro'
import { createPortal } from 'react-dom'

interface LoadingSpinnerProps {}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  const body = document.body

  return createPortal(
    <div
      css={css`
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;

        background: rgba(0, 0, 0, 0.5);

        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      {/*
      // @ts-ignore*/}
      <IconSpinner style={{ width: 70, height: 70 }} />
    </div>,
    body,
  )
}

export { LoadingSpinner }
