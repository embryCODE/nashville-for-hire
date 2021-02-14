import React, { SyntheticEvent } from 'react'
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
  quantity: number
  onQuantityChange: (q: number) => void
}

const PriceItemSelector: React.FC<PriceItemSelectorProps> = ({
  price,
  quantity,
  onQuantityChange,
}) => {
  const handleSelect = () => {
    onQuantityChange(1)
  }

  const handleQuantityChange = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      value: string
    }
    const quantity = parseInt(target.value)
    const quantityToSet = quantity > 0 ? quantity : 0

    onQuantityChange(quantityToSet)
  }

  return (
    <PriceItemSelectorWrapper>
      <span>
        {quantity > 0 ? (
          <input
            id={price.title}
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
      </span>

      <div>{price.title}</div>

      <PriceBubble>
        {price.shouldContactForPrice ? 'Contact for price' : formatPrice(price.price)}
      </PriceBubble>
    </PriceItemSelectorWrapper>
  )
}

export { PriceItemSelector }
