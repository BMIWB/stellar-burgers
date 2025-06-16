import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

// Тип состояния
export interface TIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние
export const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

// AsyncThunk для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

// Слайс ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const { clearError } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
