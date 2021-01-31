import { storableError } from '../util/errors'
import {
  TRANSITION_PRICE_NEGOTIATION,
  TRANSITION_PRICE_NEGOTIATION_AFTER_ENQUIRY,
} from '../util/transaction'
import pick from 'lodash/pick'
import config from '../config'
import { fetchCurrentUserHasOrdersSuccess } from './user.duck'
import { addMarketplaceEntities } from './marketplaceData.duck'

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/BeginNegotiationPage/SET_INITIAL_VALUES'

export const BEGIN_NEGOTIATION_REQUEST = 'app/BeginNegotiationPage/BEGIN_NEGOTIATION_REQUEST'
export const BEGIN_NEGOTIATION_SUCCESS = 'app/BeginNegotiationPage/BEGIN_NEGOTIATION_SUCCESS'
export const BEGIN_NEGOTIATION_ERROR = 'app/BeginNegotiationPage/BEGIN_NEGOTIATION_ERROR'

// ================ Reducer ================ //

const initialState = {
  listing: null,
  bookingData: null,
  transaction: null,
  beginNegotiationError: null,
}

export default function beginNegotiationPageReducer(state = initialState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_INITIAL_VALUES: {
      return { ...initialState, ...payload }
    }

    case BEGIN_NEGOTIATION_REQUEST:
      return { ...state, beginNegotiationError: null }
    case BEGIN_NEGOTIATION_SUCCESS:
      return { ...state, transaction: payload }
    case BEGIN_NEGOTIATION_ERROR:
      console.error(payload) // eslint-disable-line no-console
      return { ...state, beginNegotiationError: payload }

    default:
      return state
  }
}

// ================ Selectors ================ //

// ================ Action creators ================ //
export const setInitialValues = (initialValues) => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
})

const beginNegotiationRequest = () => ({ type: BEGIN_NEGOTIATION_REQUEST })

const beginNegotiationSuccess = (order) => ({
  type: BEGIN_NEGOTIATION_SUCCESS,
  payload: order,
})

const beginNegotiationError = (e) => ({
  type: BEGIN_NEGOTIATION_ERROR,
  error: true,
  payload: e,
})

/* ================ Thunks ================ */

export const beginNegotiation = (orderParams) => (dispatch, getState, sdk) => {
  dispatch(beginNegotiationRequest())

  const { transactionId, listingId, lineItems } = orderParams
  const message = '[System Message] Negotiation started'

  // If we have an ID, we want to transition the transaction
  if (transactionId) {
    const bodyParams = {
      id: transactionId,
      transition: TRANSITION_PRICE_NEGOTIATION_AFTER_ENQUIRY,
      params: {
        lineItems,
      },
    }

    return sdk.transactions
      .transition(bodyParams)
      .then((response) => {
        const transaction = response.data.data
        const transactionId = transaction.id

        // Send the message to the created transaction
        return sdk.messages.send({ transactionId, content: message }).then(() => {
          dispatch(beginNegotiationSuccess(transaction))
          return transactionId
        })
      })
      .catch((e) => {
        dispatch(beginNegotiationError(storableError(e)))
        throw e
      })
  } else {
    // Otherwise, we want to initiate the transaction

    const bodyParams = {
      processAlias: config.bookingProcessAlias,
      transition: TRANSITION_PRICE_NEGOTIATION,
      params: { listingId, lineItems },
    }

    return sdk.transactions
      .initiate(bodyParams)
      .then((response) => {
        const transaction = response.data.data
        const transactionId = transaction.id

        // Send the message to the created transaction
        return sdk.messages.send({ transactionId, content: message }).then(() => {
          dispatch(beginNegotiationSuccess(transaction))
          dispatch(addMarketplaceEntities(response))
          return transactionId
        })
      })
      .catch((e) => {
        dispatch(beginNegotiationError(storableError(e)))
        throw e
      })
  }
}
