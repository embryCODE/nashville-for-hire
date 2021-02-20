import { Price } from '../components/NFHCustom/types'

export const sortByPriceCode = (a: Price, b: Price) => {
  if (a.code.includes('custom')) return 1
  if (b.code.includes('custom')) return -1
  return 0
}

export const sortByPricesAndQuantityCode = ([, a]: [string, Price], [, b]: [string, Price]) => {
  if (a.code.includes('custom')) return 1
  if (b.code.includes('custom')) return -1
  return 0
}
