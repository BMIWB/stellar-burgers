import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import ingredientsSlice from './slices/ingredientsSlice';
import constructorSlice from './slices/constructorSlice';
import ordersSlice from './slices/ordersSlice';

export const rootReducer = combineReducers({
  user: userSlice,
  ingredients: ingredientsSlice,
  burgerConstructor: constructorSlice,
  orders: ordersSlice
});
