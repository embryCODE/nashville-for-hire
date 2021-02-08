import pricingOptions from './pricingOptions'

const unnestedPricingOptions = Object.values(pricingOptions)
  .flat()
  .map((po) => Object.values(po).flat())
  .flat()

const getLabelFromPricingOptions = (code: string): string => {
  const pricingOption = unnestedPricingOptions.find((po) => code.includes(po.code))
  return pricingOption ? pricingOption.label : ''
}

export default getLabelFromPricingOptions
