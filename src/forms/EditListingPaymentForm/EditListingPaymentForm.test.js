import React from 'react'
import { renderDeep } from '../../util/test-helpers'
import { fakeIntl } from '../../util/test-data'
import EditListingPaymentForm from './EditListingPaymentForm'

const noop = () => null

describe('EditListingPaymentForm', () => {
  it('matches snapshot', () => {
    const tree = renderDeep(
      <EditListingPaymentForm
        intl={fakeIntl}
        dispatch={noop}
        onSubmit={(v) => v}
        saveActionMsg="Save price"
        updated={false}
        updateInProgress={false}
        disabled={false}
        ready={false}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})
