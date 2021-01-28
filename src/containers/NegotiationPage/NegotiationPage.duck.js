import { storableError } from '../../util/errors'
import { TRANSITION_PRICE_NEGOTIATION } from '../../util/transaction'
import * as log from '../../util/log'
import pick from 'lodash/pick'

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/NegotiationPage/SET_INITIAL_VALUES'

export const SET_PRICES_REQUEST = 'app/NegotiationPage/SET_PRICES_REQUEST'
export const SET_PRICES_SUCCESS = 'app/NegotiationPage/SET_PRICES_SUCCESS'
export const SET_PRICES_ERROR = 'app/NegotiationPage/SET_PRICES_ERROR'

// ================ Reducer ================ //

const initialState = {
  listing: null,
  bookingData: null,
  transaction: null,
  setPricesError: null,
}

export default function negotiationPageReducer(state = initialState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_INITIAL_VALUES: {
      console.log(payload)
      return { ...initialState, ...payload }
    }

    case SET_PRICES_REQUEST:
      return { ...state, setPricesError: null }
    case SET_PRICES_SUCCESS:
      return { ...state, transaction: payload }
    case SET_PRICES_ERROR:
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

/* ================ Thunks ================ */

export const setPrices = (orderParams) => (dispatch, getState, sdk) => {
  dispatch(setPricesRequest())

  const bodyParams = {
    id: orderParams.transactionId,
    transition: TRANSITION_PRICE_NEGOTIATION,
    params: orderParams,
  }

  return sdk.transactions
    .transition(bodyParams)
    .then((response) => {
      const order = response.data.data
      dispatch(setPricesSuccess(order.id))
      return order
    })
    .catch((e) => {
      dispatch(setPricesError(storableError(e)))
      const transactionIdMaybe = orderParams.transactionId
        ? { transactionId: orderParams.transactionId.uuid }
        : {}
      log.error(e, 'set-prices-failed', {
        ...transactionIdMaybe,
      })
      throw e
    })
}
