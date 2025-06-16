import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';

import { setCookie, deleteCookie } from '../../utils/cookie';

// Константы
const HTTP_STATUS_UNAUTHORIZED = '401';
const BEARER_PREFIX = 'Bearer ';

// Тип состояния
export interface TUserState {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
}

// Начальное состояние
export const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null
};

// AsyncThunk: Проверка авторизации
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes(HTTP_STATUS_UNAUTHORIZED)) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// AsyncThunk: Вход
export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    const cleanAccessToken = response.accessToken.startsWith(BEARER_PREFIX)
      ? response.accessToken.substring(BEARER_PREFIX.length)
      : response.accessToken;

    setCookie('accessToken', cleanAccessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

// AsyncThunk: Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const response = await registerUserApi(registerData);
    const cleanAccessToken = response.accessToken.startsWith(BEARER_PREFIX)
      ? response.accessToken.substring(BEARER_PREFIX.length)
      : response.accessToken;

    setCookie('accessToken', cleanAccessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

// AsyncThunk: Обновление профиля
export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

// AsyncThunk: Выход
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Slice пользователя
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkUserAuth
      .addCase(checkUserAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = null;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка обновления профиля';
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
