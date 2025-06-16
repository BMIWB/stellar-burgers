import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;
const BEARER_PREFIX = 'Bearer ';

type TServerResponse<T> = {
  success: boolean;
} & T;

const checkResponse = <T>(response: Response): Promise<T> =>
  response.ok
    ? response.json()
    : response.json().then((error) => Promise.reject(error));

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const response = await fetch(url, options);
    return await checkResponse<T>(response);
  } catch (error) {
    if ((error as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          `${BEARER_PREFIX}${getCookie('accessToken')}`;
      }
      const response = await fetch(url, options);
      return await checkResponse<T>(response);
    } else {
      return Promise.reject(error);
    }
  }
};

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((response) => checkResponse<TRefreshResponse>(response))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      const cleanAccessToken = refreshData.accessToken.startsWith(BEARER_PREFIX)
        ? refreshData.accessToken.substring(BEARER_PREFIX.length)
        : refreshData.accessToken;
      setCookie('accessToken', cleanAccessToken);
      return refreshData;
    });

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: `${BEARER_PREFIX}${getCookie('accessToken')}`
    } as HeadersInit
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `${BEARER_PREFIX}${getCookie('accessToken')}`
    } as HeadersInit,
    body: JSON.stringify(user)
  });

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((response) => checkResponse<TIngredientsResponse>(response))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((response) => checkResponse<TFeedsResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

export const getOrdersApi = () => {
  const accessToken = getCookie('accessToken');

  return fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `${BEARER_PREFIX}${accessToken}`
    } as HeadersInit
  })
    .then((data) => {
      if (data?.success) {
        return data.orders;
      }
      return Promise.reject(data);
    })
    .catch((error) => {
      console.error('getOrdersApi: ошибка запроса:', error);
      throw error;
    });
};

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (ingredientIds: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `${BEARER_PREFIX}${getCookie('accessToken')}`
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: ingredientIds
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));
