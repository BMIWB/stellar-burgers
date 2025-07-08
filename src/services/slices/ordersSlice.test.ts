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

describe('ordersSlice', () => {
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

  it('должен возвращать начальное состояние', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearError', () => {
    it('должен очищать ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Ошибка загрузки'
      };

      const action = clearError();
      const state = ordersReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('clearCurrentOrder', () => {
    it('должен очищать текущий заказ', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder
      };

      const action = clearCurrentOrder();
      const state = ordersReducer(stateWithOrder, action);

      expect(state.currentOrder).toBeNull();
    });
  });

  describe('fetchOrders', () => {
    it('должен устанавливать loading в true при pending', () => {
      const action = { type: fetchOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обновлять заказы при fulfilled', () => {
      const action = {
        type: fetchOrders.fulfilled.type,
        payload: mockOrdersData
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrdersData.orders);
      expect(state.total).toBe(mockOrdersData.total);
      expect(state.totalToday).toBe(mockOrdersData.totalToday);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: fetchOrders.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка сети');
    });
  });

  describe('fetchUserOrders', () => {
    it('должен устанавливать loading в true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обновлять заказы пользователя при fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual([mockOrder]);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка авторизации' }
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('fetchOrderByNumber', () => {
    it('должен устанавливать loading в true при pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать текущий заказ при fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: 'Заказ не найден' }
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Заказ не найден');
    });
  });

  describe('createOrder', () => {
    it('должен устанавливать loading в true при pending', () => {
      const action = { type: createOrder.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен создавать заказ при fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.userOrders).toEqual([mockOrder]);
    });

    it('должен добавлять новый заказ в начало списка пользовательских заказов', () => {
      const existingOrder = { ...mockOrder, _id: 'existing-order', number: 11111 };
      const stateWithOrder = {
        ...initialState,
        userOrders: [existingOrder]
      };

      const newOrder = { ...mockOrder, _id: 'new-order', number: 22222 };
      const action = {
        type: createOrder.fulfilled.type,
        payload: newOrder
      };
      const state = ordersReducer(stateWithOrder, action);

      expect(state.userOrders).toHaveLength(2);
      expect(state.userOrders[0]).toEqual(newOrder);
      expect(state.userOrders[1]).toEqual(existingOrder);
    });

    it('должен корректно обрабатывать null заказ при fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: null
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toBeNull();
      expect(state.userOrders).toEqual([]);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка создания заказа' }
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка создания заказа');
    });

    it('должен устанавливать стандартную ошибку при rejected без сообщения', () => {
      const action = {
        type: createOrder.rejected.type,
        error: {}
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка создания заказа');
    });
  });

  describe('общие тесты состояния загрузки', () => {
    it('должен корректно переключать состояние loading', () => {
      // Начальное состояние - не загружается
      expect(initialState.loading).toBe(false);

      // Переходим в состояние загрузки
      let state = ordersReducer(initialState, { type: fetchOrders.pending.type });
      expect(state.loading).toBe(true);

      // Завершаем загрузку успешно
      state = ordersReducer(state, {
        type: fetchOrders.fulfilled.type,
        payload: mockOrdersData
      });
      expect(state.loading).toBe(false);
    });

    it('должен очищать ошибку при новом запросе', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      const state = ordersReducer(stateWithError, { type: fetchOrders.pending.type });

      expect(state.error).toBeNull();
      expect(state.loading).toBe(true);
    });
  });
});
