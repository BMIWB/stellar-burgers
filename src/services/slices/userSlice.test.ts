// Импорты
import ordersReducer, {
  fetchOrders,
  fetchUserOrders,
  fetchOrderByNumber,
  createOrder,
  clearError,
  clearCurrentOrder,
  initialState
} from './ordersSlice';

import { TOrder } from '@utils-types';

// Моки
const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Space бургер',
  createdAt: '2023-04-17T10:47:00.000Z',
  updatedAt: '2023-04-17T10:47:00.000Z',
  number: 12345,
  ingredients: ['ingredient-1', 'ingredient-2']
};

const mockOrdersData = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

// Тесты ordersSlice
describe('ordersSlice', () => {
  // --- Общие ---
  it('должен возвращать начальное состояние', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearError', () => {
    it('очищает ошибку', () => {
      const state = ordersReducer(
        { ...initialState, error: 'Ошибка загрузки' },
        clearError()
      );
      expect(state.error).toBeNull();
    });
  });

  describe('clearCurrentOrder', () => {
    it('очищает текущий заказ', () => {
      const state = ordersReducer(
        { ...initialState, currentOrder: mockOrder },
        clearCurrentOrder()
      );
      expect(state.currentOrder).toBeNull();
    });
  });

  // --- fetchOrders ---
  describe('fetchOrders', () => {
    it('устанавливает loading при pending', () => {
      const state = ordersReducer(initialState, {
        type: fetchOrders.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('обновляет заказы при fulfilled', () => {
      const state = ordersReducer(initialState, {
        type: fetchOrders.fulfilled.type,
        payload: mockOrdersData
      });

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrdersData.orders);
      expect(state.total).toBe(mockOrdersData.total);
      expect(state.totalToday).toBe(mockOrdersData.totalToday);
    });

    it('устанавливает ошибку при rejected', () => {
      const state = ordersReducer(initialState, {
        type: fetchOrders.rejected.type,
        error: { message: 'Ошибка сети' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка сети');
    });
  });

  // --- fetchUserOrders ---
  describe('fetchUserOrders', () => {
    it('устанавливает loading при pending', () => {
      const state = ordersReducer(initialState, {
        type: fetchUserOrders.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('обновляет заказы пользователя при fulfilled', () => {
      const state = ordersReducer(initialState, {
        type: fetchUserOrders.fulfilled.type,
        payload: [mockOrder]
      });

      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual([mockOrder]);
    });

    it('устанавливает ошибку при rejected', () => {
      const state = ordersReducer(initialState, {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка авторизации' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  // --- fetchOrderByNumber ---
  describe('fetchOrderByNumber', () => {
    it('устанавливает loading при pending', () => {
      const state = ordersReducer(initialState, {
        type: fetchOrderByNumber.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('устанавливает текущий заказ при fulfilled', () => {
      const state = ordersReducer(initialState, {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      });

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
    });

    it('устанавливает ошибку при rejected', () => {
      const state = ordersReducer(initialState, {
        type: fetchOrderByNumber.rejected.type,
        error: { message: 'Заказ не найден' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Заказ не найден');
    });
  });

  // --- createOrder ---
  describe('createOrder', () => {
    it('устанавливает loading при pending', () => {
      const state = ordersReducer(initialState, {
        type: createOrder.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('создаёт заказ при fulfilled', () => {
      const state = ordersReducer(initialState, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.userOrders).toEqual([mockOrder]);
    });

    it('добавляет заказ в начало списка', () => {
      const existingOrder = {
        ...mockOrder,
        _id: 'existing-order',
        number: 11111
      };
      const newOrder = { ...mockOrder, _id: 'new-order', number: 22222 };

      const state = ordersReducer(
        { ...initialState, userOrders: [existingOrder] },
        {
          type: createOrder.fulfilled.type,
          payload: newOrder
        }
      );

      expect(state.userOrders).toEqual([newOrder, existingOrder]);
    });

    it('обрабатывает null заказ при fulfilled', () => {
      const state = ordersReducer(initialState, {
        type: createOrder.fulfilled.type,
        payload: null
      });

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toBeNull();
      expect(state.userOrders).toEqual([]);
    });

    it('устанавливает ошибку при rejected', () => {
      const state = ordersReducer(initialState, {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка создания заказа' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка создания заказа');
    });

    it('устанавливает стандартную ошибку при rejected без сообщения', () => {
      const state = ordersReducer(initialState, {
        type: createOrder.rejected.type,
        error: {}
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка создания заказа');
    });
  });

  // --- Общие тесты состояния загрузки ---
  describe('общие тесты состояния загрузки', () => {
    it('переключает флаг loading корректно', () => {
      expect(initialState.loading).toBe(false);

      let state = ordersReducer(initialState, {
        type: fetchOrders.pending.type
      });
      expect(state.loading).toBe(true);

      state = ordersReducer(state, {
        type: fetchOrders.fulfilled.type,
        payload: mockOrdersData
      });
      expect(state.loading).toBe(false);
    });

    it('очищает ошибку при новом запросе', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      const state = ordersReducer(stateWithError, {
        type: fetchOrders.pending.type
      });

      expect(state.error).toBeNull();
      expect(state.loading).toBe(true);
    });
  });
});
