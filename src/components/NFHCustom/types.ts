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
  serviceType: string
  whyAreYouTheRightFit: string
}

export interface Audio {
  fileName: string
  title: string
}

export type PriceData = null | {
  amount: number
  currency: string
}

export interface Price {
  label: string
  placeholder: string
  price: PriceData
  shouldContactForPrice: boolean
}

export interface PriceWithQuantity extends Price {
  quantity: number
}
