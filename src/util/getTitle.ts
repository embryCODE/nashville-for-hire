import { PublicData } from '../components/NFHCustom/types'

const getTitle = (code: string, publicData: PublicData) => {
  const pricesArray = Object.values(publicData.prices)
  const realCode = code.split('/')[1]
  const price = pricesArray.find((p) => p.code === realCode)

  if (!price)
    throw new Error(
      `Pricing data not found for line item called "${code}". Listing type may have been changed.`,
    )

  return price.title
}

export default getTitle
