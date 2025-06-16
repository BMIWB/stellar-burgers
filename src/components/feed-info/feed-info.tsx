import { FC } from 'react';
import { useSelector } from '../../services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { selectOrdersState } from '../../services/selectors/ordersSelectors';
import { MAX_ORDERS_TO_SHOW } from '../../utils/constants';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status)
    .map((order) => order.number)
    .slice(0, MAX_ORDERS_TO_SHOW);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(selectOrdersState);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ orders, total, totalToday }}
    />
  );
};
