import axios, { type AxiosRequestConfig } from 'axios';
import { BASE_API_URL } from '../constant';
import authService from './AuthService';
import type { ErrorResponseDto } from '../types/CommonType'; 

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any | null, success = false) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (success) {
      resolve(null);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;
    const statusCode = error.response?.status;
    const errorResponseData: ErrorResponseDto | undefined = error.response?.data;

    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        await authService.refreshToken();
        processQueue(null, true);
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, false);
        
        const finalError = new Error(refreshError.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        (finalError as any).statusCode = refreshError.statusCode || 401;
        (finalError as any).code = (refreshError.response?.data as ErrorResponseDto)?.code || 'TOKEN_REFRESH_FAILED';
        (finalError as any).details = (refreshError.response?.data as ErrorResponseDto)?.details;
        (finalError as any).traceId = (refreshError.response?.data as ErrorResponseDto)?.traceId;

        return Promise.reject(finalError);
      } finally {
        isRefreshing = false;
      }
    }

    if (errorResponseData) {
      const customError = new Error(errorResponseData.message || 'Đã có lỗi xảy ra từ server.');
      (customError as any).code = errorResponseData.code;
      (customError as any).details = errorResponseData.details;
      (customError as any).traceId = errorResponseData.traceId;
      (customError as any).statusCode = statusCode;

      return Promise.reject(customError);
    }

    return Promise.reject(new Error('Mất kết nối server hoặc lỗi không xác định.'));
  }
);

const axiosNoAuthInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosNoWithCredInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosInstance, axiosNoAuthInstance, axiosNoWithCredInstance };