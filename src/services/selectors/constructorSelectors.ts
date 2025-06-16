import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectConstructorState = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorBun = createSelector(
  [selectConstructorState],
  (constructorState) => constructorState.bun
);

export const selectConstructorIngredients = createSelector(
  [selectConstructorState],
  (constructorState) => constructorState.ingredients
);

export const selectConstructorItems = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients: ingredients || []
  })
);

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients
      ? ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
      : 0;

    return bunPrice + ingredientsPrice;
  }
);

export const selectCanCreateOrder = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => !!bun && ingredients.length > 0
);
