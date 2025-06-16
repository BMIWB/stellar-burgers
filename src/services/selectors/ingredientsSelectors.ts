import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectIngredientsState = (state: RootState) => state.ingredients;

export const selectIngredients = createSelector(
  [selectIngredientsState],
  (state) => state.ingredients
);

export const selectIngredientsLoading = createSelector(
  [selectIngredientsState],
  (state) => state.loading
);

export const selectIngredientsError = createSelector(
  [selectIngredientsState],
  (state) => state.error
);

export const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((ing) => ing.type === 'bun')
);

export const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((ing) => ing.type === 'main')
);

export const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((ing) => ing.type === 'sauce')
);

export const selectIngredientById = createSelector(
  [selectIngredients, (_: RootState, id: string) => id],
  (ingredients, id) => ingredients.find((ing) => ing._id === id)
);
