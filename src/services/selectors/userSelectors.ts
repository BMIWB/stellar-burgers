import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectUserState = (state: RootState) => state.user;

export const selectUser = createSelector(
  [selectUserState],
  (state) => state.user
);

export const selectIsAuthChecked = createSelector(
  [selectUserState],
  (state) => state.isAuthChecked
);

export const selectUserError = createSelector(
  [selectUserState],
  (state) => state.error
);

export const selectIsAuthenticated = createSelector(
  [selectUser],
  (user) => !!user
);
