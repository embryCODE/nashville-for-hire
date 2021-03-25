export interface ListingAttributes {
  title: string
  description: null // May not need
  publicData: PublicData
  deleted: boolean
  geolocation: null // May not need
  createdAt: string
  state: string // "published" || ???
  availabilityPlan: null // May not need
  price: null // May not need
  metadata: unknown // Empty object. May not need
}

export interface PublicData {
  agreeToTermsOfUse: boolean
  audio: Audio[]
  averageTurnaroundTime: string
  experience: string
  explainMore: string
  prices: Record<string, Price>
  primaryGenres: string
  whyAreYouTheRightFit: string
}

export interface Audio {
  fileName: string
  name?: string
  description?: string
}

export interface File {
  fileName: string
  name?: string
  description?: string
}

export type PriceData = null | {
  amount: number
  currency: string
}

export interface Price {
  code: string
  title: string
  description: string
  price: PriceData
  shouldContactForPrice: boolean
  turnaroundTime?: string
}

export interface PriceWithQuantity extends Price {
  quantity: number
}
