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

const HTTP_STATUS_UNAUTHORIZED = '401';
const BEARER_PREFIX = 'Bearer ';

export interface TUserState {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
}

export const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null
};

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: unknown) {
      // 401 ошибка - это нормально, пользователь просто не авторизован
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes(HTTP_STATUS_UNAUTHORIZED)) {
        return rejectWithValue('unauthorized');
      }
      // Для других ошибок пробрасываем их дальше
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    // Убираем префикс "Bearer " из токена перед сохранением
    const cleanAccessToken = response.accessToken.startsWith(BEARER_PREFIX)
      ? response.accessToken.substring(BEARER_PREFIX.length)
      : response.accessToken;
    setCookie('accessToken', cleanAccessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const response = await registerUserApi(registerData);
    // Убираем префикс "Bearer " из токена перед сохранением
    const cleanAccessToken = response.accessToken.startsWith(BEARER_PREFIX)
      ? response.accessToken.substring(BEARER_PREFIX.length)
      : response.accessToken;
    setCookie('accessToken', cleanAccessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

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
      .addCase(checkUserAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        // Не показываем ошибку для 401 - это нормальное состояние неавторизованного пользователя
        state.error = null;
      })
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
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка обновления профиля';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
