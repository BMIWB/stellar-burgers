import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

// Тип состояния
export interface TOrdersState {
  orders: TOrder[]; // Общая лента заказов
  userOrders: TOrder[]; // Заказы пользователя
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
export const initialState: TOrdersState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  loading: false,
  error: null
};

// AsyncThunk: Получение общей ленты заказов
export const fetchOrders = createAsyncThunk('orders/fetchOrders', getFeedsApi);

// AsyncThunk: Получение заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getOrdersApi();
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// AsyncThunk: Получение заказа по номеру
const FIRST_ORDER_INDEX = 0;

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[FIRST_ORDER_INDEX];
  }
);

// AsyncThunk: Создание нового заказа
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

// Slice заказов
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })

      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })

      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        if (action.payload) {
          state.userOrders = [action.payload, ...state.userOrders];
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearError, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
