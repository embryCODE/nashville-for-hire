import { PublicData } from '../components/NFHCustom/types'

const getTitle = (code: string, publicData: PublicData) => {
  const pricesArray = Object.values(publicData.prices)
  const realCode = code.split('/')[1]
  const price = pricesArray.find((p) => p.code === realCode)

  if (!price) throw new Error()

  return price.title
}

export default getTitle
