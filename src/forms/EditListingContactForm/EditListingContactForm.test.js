import React from 'react'
import { renderDeep } from '../../util/test-helpers'
import { fakeIntl } from '../../util/test-data'
import EditListingContactForm from './EditListingContactForm'

const noop = () => null

describe('EditListingContactForm', () => {
  it('matches snapshot', () => {
    const tree = renderDeep(
      <EditListingContactForm
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
