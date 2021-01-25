import React, { FormEventHandler, SyntheticEvent, useState } from 'react'
import { Price, PriceData } from '../../types'
import styled from 'styled-components'
import { css } from 'styled-components/macro'

const PriceItemSelectorWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;

  input {
    width: 48px;
  }

  div {
    flex: 1;
    margin-left: 0.5rem;
  }
`

const PriceBubble = styled.div`
  position: absolute;
  top: -24px;
  left: 40px;
  padding: 4px 8px;
  font-size: 14px;
`

const formatPrice = (pd: PriceData): string => {
  return pd !== null ? `$${pd.amount / 100}` : ''
}

interface PriceItemSelectorProps {
  price: Price
}

const PriceItemSelector: React.FC<PriceItemSelectorProps> = ({ price }) => {
  const [quantity, setQuantity] = useState<number>(0)

  const handleSelect = () => {
    setQuantity(1)
  }

  const handleQuantityChange = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      value: string
    }
    const quantity = parseInt(target.value)
    const quantityToSet = quantity > 0 ? quantity : 0

    setQuantity(quantityToSet)
  }

  return (
    <PriceItemSelectorWrapper>
      {quantity > 0 ? (
        <input
          id={price.label}
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          css={css`
            margin-top: -10px;
          `}
        />
      ) : (
        <input
          type="checkbox"
          onChange={handleSelect}
          css={css`
            margin-top: 6px;
          `}
        />
      )}

      <div>{price.label}</div>

      <PriceBubble>
        {price.shouldContactForPrice ? 'Contact for price' : formatPrice(price.price)}
      </PriceBubble>
    </PriceItemSelectorWrapper>
  )
}

export { PriceItemSelector }
