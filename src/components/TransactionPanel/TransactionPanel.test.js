import React from 'react';
import { shallow } from 'enzyme';
import { types } from '../../util/sdkLoader';
import {
  createTransaction,
  createBooking,
  createListing,
  createUser,
  createCurrentUser,
  createMessage,
} from '../../util/test-data';
import { renderShallow } from '../../util/test-helpers';
import { fakeIntl } from '../../util/test-data';
import * as propTypes from '../../util/propTypes';
import { BreakdownMaybe } from './TransactionPanel.helpers';
import { TransactionPanelComponent } from './TransactionPanel';

const noop = () => null;

const { Money } = types;

describe('TransactionPanel - Sale', () => {
  const baseTxAttrs = {
    total: new Money(16500, 'USD'),
    commission: new Money(1000, 'USD'),
    booking: createBooking('booking1', {
      start: new Date(Date.UTC(2017, 5, 10)),
      end: new Date(Date.UTC(2017, 5, 13)),
    }),
    listing: createListing('listing1'),
    customer: createUser('customer1'),
    lastTransitionedAt: new Date(Date.UTC(2017, 5, 10)),
  };
  const txPreauthorized = createTransaction({
    id: 'sale-preauthorized',
    lastTransition: propTypes.TX_TRANSITION_PREAUTHORIZE,
    ...baseTxAttrs,
  });

  const txAccepted = createTransaction({
    id: 'sale-accepted',
    lastTransition: propTypes.TX_TRANSITION_ACCEPT,
    ...baseTxAttrs,
  });

  const txDeclined = createTransaction({
    id: 'sale-declined',
    lastTransition: propTypes.TX_TRANSITION_DECLINE,
    ...baseTxAttrs,
  });

  const txAutoDeclined = createTransaction({
    id: 'sale-autodeclined',
    lastTransition: propTypes.TX_TRANSITION_AUTO_DECLINE,
    ...baseTxAttrs,
  });

  const txCanceled = createTransaction({
    id: 'sale-canceled',
    lastTransition: propTypes.TX_TRANSITION_CANCELED,
    ...baseTxAttrs,
  });

  const txDelivered = createTransaction({
    id: 'sale-delivered',
    lastTransition: propTypes.TX_TRANSITION_MARK_DELIVERED,
    ...baseTxAttrs,
  });

  const panelBaseProps = {
    onAcceptSale: noop,
    onDeclineSale: noop,
    acceptInProgress: false,
    declineInProgress: false,
    currentUser: createCurrentUser('user1'),
    totalMessages: 2,
    totalMessagePages: 1,
    oldestMessagePageFetched: 1,
    messages: [
      createMessage('msg1', {}, { sender: createUser('user1') }),
      createMessage('msg2', {}, { sender: createUser('user2') }),
    ],
    initialMessageFailed: false,
    fetchMessagesInProgress: false,
    sendMessageInProgress: false,
    sendReviewInProgress: false,
    onManageDisableScrolling: noop,
    onOpenReviewModal: noop,
    onShowMoreMessages: noop,
    onSendMessage: noop,
    onSendReview: noop,
    onResetForm: noop,
    intl: fakeIntl,
  };

  it('preauthorized matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txPreauthorized,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('accepted matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txAccepted,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('declined matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txDeclined,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('autodeclined matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txAutoDeclined,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('canceled matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txCanceled,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('delivered matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txDelivered,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('renders correct total price', () => {
    const transaction = createTransaction({
      id: 'sale-tx',
      lastTransition: propTypes.TX_TRANSITION_PREAUTHORIZE,
      total: new Money(16500, 'USD'),
      commission: new Money(1000, 'USD'),
      booking: createBooking('booking1', {
        start: new Date(Date.UTC(2017, 5, 10)),
        end: new Date(Date.UTC(2017, 5, 13)),
      }),
      listing: createListing('listing1'),
      customer: createUser('customer1'),
      lastTransitionedAt: new Date(Date.UTC(2017, 5, 10)),
    });
    const props = {
      ...panelBaseProps,
      transaction,
    };
    const panel = shallow(<TransactionPanelComponent {...props} />);
    const breakdownProps = panel
      .find(BreakdownMaybe)
      .first()
      .props();

    // Total price for the provider should be transaction total minus the commission.
    expect(breakdownProps.transaction.attributes.payoutTotal).toEqual(new Money(15500, 'USD'));
  });
});

describe('TransactionPanel - Order', () => {
  const baseTxAttrs = {
    total: new Money(16500, 'USD'),
    booking: createBooking('booking1', {
      start: new Date(Date.UTC(2017, 5, 10)),
      end: new Date(Date.UTC(2017, 5, 13)),
    }),
    listing: createListing('listing1'),
    provider: createUser('provider'),
    customer: createUser('customer'),
  };

  const txPreauthorized = createTransaction({
    id: 'order-preauthorized',
    lastTransition: propTypes.TX_TRANSITION_PREAUTHORIZE,
    ...baseTxAttrs,
  });

  const txAccepted = createTransaction({
    id: 'order-accepted',
    lastTransition: propTypes.TX_TRANSITION_ACCEPT,
    ...baseTxAttrs,
  });

  const txDeclined = createTransaction({
    id: 'order-declined',
    lastTransition: propTypes.TX_TRANSITION_DECLINE,
    ...baseTxAttrs,
  });

  const txAutoDeclined = createTransaction({
    id: 'order-autodeclined',
    lastTransition: propTypes.TX_TRANSITION_AUTO_DECLINE,
    ...baseTxAttrs,
  });

  const txCanceled = createTransaction({
    id: 'order-canceled',
    lastTransition: propTypes.TX_TRANSITION_CANCELED,
    ...baseTxAttrs,
  });

  const txDelivered = createTransaction({
    id: 'order-delivered',
    lastTransition: propTypes.TX_TRANSITION_MARK_DELIVERED,
    ...baseTxAttrs,
  });

  const panelBaseProps = {
    intl: fakeIntl,
    currentUser: createCurrentUser('user2'),
    totalMessages: 2,
    totalMessagePages: 1,
    oldestMessagePageFetched: 1,
    messages: [
      createMessage('msg1', {}, { sender: createUser('user1') }),
      createMessage('msg2', {}, { sender: createUser('user2') }),
    ],
    initialMessageFailed: false,
    fetchMessagesInProgress: false,
    sendMessageInProgress: false,
    sendReviewInProgress: false,
    onManageDisableScrolling: noop,
    onOpenReviewModal: noop,
    onShowMoreMessages: noop,
    onSendMessage: noop,
    onSendReview: noop,
    onResetForm: noop,
    onAcceptSale: noop,
    onDeclineSale: noop,
    acceptInProgress: false,
    declineInProgress: false,
  };

  it('preauthorized matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txPreauthorized,
    };

    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('accepted matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txAccepted,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('declined matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txDeclined,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('autodeclined matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txAutoDeclined,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('canceled matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txCanceled,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('delivered matches snapshot', () => {
    const props = {
      ...panelBaseProps,
      transaction: txDelivered,
    };
    const tree = renderShallow(<TransactionPanelComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('renders correct total price', () => {
    const { Money } = types;
    const tx = createTransaction({
      id: 'order-tx',
      lastTransition: propTypes.TX_TRANSITION_PREAUTHORIZE,
      total: new Money(16500, 'USD'),
      booking: createBooking('booking1', {
        start: new Date(Date.UTC(2017, 5, 10)),
        end: new Date(Date.UTC(2017, 5, 13)),
      }),
      listing: createListing('listing1'),
      provider: createUser('provider'),
      customer: createUser('customer'),
    });
    const props = {
      ...panelBaseProps,
      transaction: tx,
    };
    const panel = shallow(<TransactionPanelComponent {...props} />);
    const breakdownProps = panel
      .find(BreakdownMaybe)
      .first()
      .props();
    expect(breakdownProps.transaction.attributes.payinTotal).toEqual(new Money(16500, 'USD'));
  });
});
