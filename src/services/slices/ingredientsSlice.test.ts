// Импорты
import ingredientsReducer, {
  fetchIngredients,
  clearError,
  initialState,
} from './ingredientsSlice';

import { TIngredient } from '@utils-types';

// Моковые данные
const mockIngredients: TIngredient[] = [
  {
    _id: 'ingredient-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'test-image.png',
    image_large: 'test-image-large.png',
    image_mobile: 'test-image-mobile.png',
  },
  {
    _id: 'ingredient-2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'test-image.png',
    image_large: 'test-image-large.png',
    image_mobile: 'test-image-mobile.png',
  },
];

// Тесты для ingredientsSlice
describe('ingredientsSlice', () => {
  // --- Общие ---
  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearError', () => {
    it('очищает ошибку', () => {
      const state = ingredientsReducer(
        { ...initialState, error: 'Ошибка загрузки' },
        clearError()
      );
      expect(state.error).toBeNull();
    });
  });

  // --- fetchIngredients ---
  describe('fetchIngredients', () => {
    it('устанавливает loading при pending', () => {
      const state = ingredientsReducer(initialState, { type: fetchIngredients.pending.type });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('обновляет ингредиенты при fulfilled', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      });

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('устанавливает ошибку при rejected', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сети' },
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка сети');
      expect(state.ingredients).toEqual([]);
    });

    it('устанавливает стандартную ошибку при rejected без сообщения', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: {},
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });

    it('обрабатывает переход из loading в fulfilled', () => {
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type,
      });
      expect(state.loading).toBe(true);

      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      });
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('обрабатывает переход из loading в rejected', () => {
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type,
      });
      expect(state.loading).toBe(true);

      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сервера' },
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка сервера');
    });
  });
});
