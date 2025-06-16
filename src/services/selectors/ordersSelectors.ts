import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectOrdersState = (state: RootState) => state.orders;

export const selectOrders = createSelector(
  [selectOrdersState],
  (state) => state.orders
);

export const selectUserOrders = createSelector(
  [selectOrdersState],
  (state) => state.userOrders
);

export const selectCurrentOrder = createSelector(
  [selectOrdersState],
  (state) => state.currentOrder
);

export const selectOrdersLoading = createSelector(
  [selectOrdersState],
  (state) => state.loading
);

export const selectOrdersError = createSelector(
  [selectOrdersState],
  (state) => state.error
);

export const selectTotal = createSelector(
  [selectOrdersState],
  (state) => state.total
);

export const selectTotalToday = createSelector(
  [selectOrdersState],
  (state) => state.totalToday
);

export const selectOrdersByStatus = createSelector(
  [selectOrders, (_: RootState, status: string) => status],
  (orders, status) => orders.filter((order) => order.status === status)
);

export const selectReadyOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === 'done')
);

export const selectPendingOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === 'pending')
);
