import { storableError } from '../util/errors'
import {
  TRANSITION_COMPLETE,
  TRANSITION_PRICE_NEGOTIATION,
  TRANSITION_PRICE_NEGOTIATION_AFTER_ENQUIRY,
  TRANSITION_SET_PRICES,
} from '../util/transaction'
import pick from 'lodash/pick'
import config from '../config'

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/BeginNegotiationPage/SET_INITIAL_VALUES'

export const BEGIN_NEGOTIATION_REQUEST = 'app/BeginNegotiationPage/BEGIN_NEGOTIATION_REQUEST'
export const BEGIN_NEGOTIATION_SUCCESS = 'app/BeginNegotiationPage/BEGIN_NEGOTIATION_SUCCESS'
export const BEGIN_NEGOTIATION_ERROR = 'app/BeginNegotiationPage/BEGIN_NEGOTIATION_ERROR'

export const SET_PRICES_REQUEST = 'app/BeginNegotiationPage/SET_PRICES_REQUEST'
export const SET_PRICES_SUCCESS = 'app/BeginNegotiationPage/SET_PRICES_SUCCESS'
export const SET_PRICES_ERROR = 'app/BeginNegotiationPage/SET_PRICES_ERROR'

export const COMPLETE_ORDER_REQUEST = 'app/BeginNegotiationPage/COMPLETE_ORDER_REQUEST'
export const COMPLETE_ORDER_SUCCESS = 'app/BeginNegotiationPage/COMPLETE_ORDER_SUCCESS'
export const COMPLETE_ORDER_ERROR = 'app/BeginNegotiationPage/COMPLETE_ORDER_ERROR'

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

    case SET_PRICES_REQUEST:
      return { ...state, setPricesError: null }
    case SET_PRICES_SUCCESS:
      return { ...state, transaction: payload }
    case SET_PRICES_ERROR:
      console.error(payload) // eslint-disable-line no-console
      return { ...state, setPricesError: payload }

    case COMPLETE_ORDER_REQUEST:
      return { ...state, setPricesError: null }
    case COMPLETE_ORDER_SUCCESS:
      return { ...state, transaction: payload }
    case COMPLETE_ORDER_ERROR:
      console.error(payload) // eslint-disable-line no-console
      return { ...state, setPricesError: payload }

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

const setPricesRequest = () => ({ type: SET_PRICES_REQUEST })

const setPricesSuccess = (order) => ({
  type: SET_PRICES_SUCCESS,
  payload: order,
})

const setPricesError = (e) => ({
  type: SET_PRICES_ERROR,
  error: true,
  payload: e,
})

const completeOrderRequest = () => ({ type: COMPLETE_ORDER_REQUEST })

const completeOrderSuccess = (order) => ({
  type: COMPLETE_ORDER_SUCCESS,
  payload: order,
})

const completeOrderError = (e) => ({
  type: COMPLETE_ORDER_ERROR,
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
          return transactionId
        })
      })
      .catch((e) => {
        dispatch(beginNegotiationError(storableError(e)))
        throw e
      })
  }
}

export const setPrices = (orderParams) => (dispatch, getState, sdk) => {
  dispatch(setPricesRequest())

  const { transactionId, lineItems } = orderParams
  const message = '[System Message] Prices set'

  const bodyParams = {
    id: transactionId,
    transition: TRANSITION_SET_PRICES,
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
        dispatch(setPricesSuccess(transaction))
        return transactionId
      })
    })
    .catch((e) => {
      dispatch(setPricesError(storableError(e)))
      throw e
    })
}

export const completeOrder = (orderParams) => (dispatch, getState, sdk) => {
  dispatch(completeOrderRequest())

  const { transactionId } = orderParams
  const message = '[System Message] Order complete'

  const bodyParams = {
    id: transactionId,
    transition: TRANSITION_COMPLETE,
    params: {},
  }

  return sdk.transactions
    .transition(bodyParams)
    .then((response) => {
      const transaction = response.data.data
      const transactionId = transaction.id

      // Send the message to the created transaction
      return sdk.messages.send({ transactionId, content: message }).then(() => {
        dispatch(completeOrderSuccess(transaction))
        return transactionId
      })
    })
    .catch((e) => {
      dispatch(completeOrderError(storableError(e)))
      throw e
    })
}
