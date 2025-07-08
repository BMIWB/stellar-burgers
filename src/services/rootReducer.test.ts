// Импорты
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './rootReducer';

import { initialState as userInitialState } from './slices/userSlice';
import { initialState as ingredientsInitialState } from './slices/ingredientsSlice';
import { initialState as constructorInitialState } from './slices/constructorSlice';
import { initialState as ordersInitialState } from './slices/ordersSlice';

describe('rootReducer', () => {
  it('должен правильно инициализировать начальное состояние', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toEqual({
      user: userInitialState,
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      orders: ordersInitialState,
    });
  });

  it('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      user: userInitialState,
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      orders: ordersInitialState,
    });
  });

  it('должен содержать все необходимые редьюсеры', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
  });
});
