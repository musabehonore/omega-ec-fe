'use client';

import axios, {
  AxiosInstance,
  Method,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders
} from 'axios';

export const URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  authenticate?: boolean;
}

export let token: string | null = null;

if (typeof window !== 'undefined') {
  const tokenString = localStorage.getItem('token');
  if (tokenString) {
    try {
      token = JSON.parse(tokenString);
    } catch (error) {
      console.error('Failed to parse token from localStorage', error);
    }
  }
}

export const axiosInstanceWithoutInterceptors: AxiosInstance = axios.create({
  baseURL: `${URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstanceWithoutInterceptors.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (config.authenticate && token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (config.authenticate && token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login';
      }
    }
    if (error.response?.status === 403) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const axiosRequest = async <TRequest = any, TResponse = any>(
  method: Method,
  url: string,
  data?: TRequest,
  authenticate?: boolean,
  bypassInterceptors?: boolean
): Promise<AxiosResponse<TResponse>> => {
  const headers: AxiosHeaders = new AxiosHeaders();

  if (data instanceof FormData) {
    headers.set('Content-Type', 'multipart/form-data');
  }
  const requestConfig: CustomAxiosRequestConfig = {
    method,
    url,
    data,
    headers,
    authenticate
  };

  const instance = bypassInterceptors
    ? axiosInstanceWithoutInterceptors
    : axiosInstance;

  return instance.request<TResponse>(requestConfig);
};

export default axiosInstance;
