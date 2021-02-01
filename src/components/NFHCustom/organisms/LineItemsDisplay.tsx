import React from 'react'
import pricingOptions from '../../../util/pricingOptions'

const unnestedPricingOptions = Object.values(pricingOptions)
  .flat()
  .map((po) => Object.values(po).flat())
  .flat()

const getLabel = (code: string): string => {
  return unnestedPricingOptions.find((po) => code.includes(po.code)).label
}

interface LineItemsDisplayProps {
  lineItems: any
}

const LineItemsDisplay: React.FC<LineItemsDisplayProps> = ({ lineItems }) => {
  return (
    <div>
      {Object.values(lineItems).map((li: any) => {
        return (
          <div key={li.code}>
            <h4>{getLabel(li.code)}</h4>
            <span>
              ${li.unitPrice.amount / 100 || 0} x {li.quantity.toNumber()} = $
              {li.lineTotal.amount / 100 || 0}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { LineItemsDisplay }
