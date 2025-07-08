// Импорты
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from './constructorSlice';

import { TIngredient } from '@utils-types';

// Моковые ингредиенты
const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'test-image.png',
  image_large: 'test-image-large.png',
  image_mobile: 'test-image-mobile.png'
};

const mockIngredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'test-image.png',
  image_large: 'test-image-large.png',
  image_mobile: 'test-image-mobile.png'
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'test-image.png',
  image_large: 'test-image-large.png',
  image_mobile: 'test-image-mobile.png'
};

// Тесты
describe('constructorSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  // --- addIngredient ---
  describe('addIngredient', () => {
    it('добавляет булку', () => {
      const state = constructorReducer(initialState, addIngredient(mockBun));
      expect(state.bun).toBeDefined();
      expect(state.bun?.name).toBe('Краторная булка N-200i');
      expect(state.bun?.type).toBe('bun');
      expect(state.bun?.id).toBeDefined();
    });

    it('заменяет существующую булку', () => {
      const prevState = {
        ...initialState,
        bun: { ...mockBun, id: 'old-id' }
      };

      const newBun = { ...mockBun, _id: 'new-bun', name: 'Новая булка' };
      const state = constructorReducer(prevState, addIngredient(newBun));

      expect(state.bun?.name).toBe('Новая булка');
      expect(state.bun?._id).toBe('new-bun');
    });

    it('добавляет ингредиент', () => {
      const state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
      expect(state.ingredients[0].type).toBe('main');
      expect(state.ingredients[0].id).toBeDefined();
    });

    it('добавляет соус', () => {
      const state = constructorReducer(initialState, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Соус Spicy-X');
      expect(state.ingredients[0].type).toBe('sauce');
    });

    it('добавляет несколько ингредиентов', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
      expect(state.ingredients[1].name).toBe('Соус Spicy-X');
    });
  });

  // --- removeIngredient ---
  describe('removeIngredient', () => {
    it('удаляет ингредиент по id', () => {
      const prevState = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockSauce, id: 'id-2' }
        ]
      };

      const state = constructorReducer(prevState, removeIngredient('id-1'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('id-2');
      expect(state.ingredients[0].name).toBe('Соус Spicy-X');
    });

    it('оставляет состояние без изменений, если id не найден', () => {
      const prevState = {
        ...initialState,
        ingredients: [{ ...mockIngredient, id: 'id-1' }]
      };

      const state = constructorReducer(
        prevState,
        removeIngredient('non-existent-id')
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('id-1');
    });
  });

  // --- moveIngredient ---
  describe('moveIngredient', () => {
    const ingredients = [
      { ...mockIngredient, id: 'id-1' },
      { ...mockSauce, id: 'id-2' },
      { ...mockIngredient, id: 'id-3' }
    ];

    it('перемещает ингредиент вверх', () => {
      const state = constructorReducer(
        { ...initialState, ingredients: [...ingredients] },
        moveIngredient({ from: 2, to: 0 })
      );

      expect(state.ingredients[0].id).toBe('id-3');
      expect(state.ingredients[1].id).toBe('id-1');
      expect(state.ingredients[2].id).toBe('id-2');
    });

    it('перемещает ингредиент вниз', () => {
      const state = constructorReducer(
        { ...initialState, ingredients: [...ingredients] },
        moveIngredient({ from: 0, to: 2 })
      );

      expect(state.ingredients[0].id).toBe('id-2');
      expect(state.ingredients[1].id).toBe('id-3');
      expect(state.ingredients[2].id).toBe('id-1');
    });

    it('перемещает ингредиенты в середине списка', () => {
      const state = constructorReducer(
        { ...initialState, ingredients: [...ingredients] },
        moveIngredient({ from: 1, to: 2 })
      );

      expect(state.ingredients.map((i) => i.id)).toEqual([
        'id-1',
        'id-3',
        'id-2'
      ]);
    });
  });

  // --- clearConstructor ---
  describe('clearConstructor', () => {
    it('очищает конструктор полностью', () => {
      const prevState = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockSauce, id: 'id-2' }
        ]
      };

      const state = constructorReducer(prevState, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
