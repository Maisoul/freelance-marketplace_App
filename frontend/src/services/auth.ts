import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosInstance from './axios';

interface RefreshResponse {
  access: string;
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axiosInstance.post<RefreshResponse>('/api/token/refresh/', {
    refresh: refreshToken,
  });
  return response.data.access;
};

export const handleApiError = async (error: AxiosError): Promise<never> => {
  const originalRequest = error.config as RetryConfig | undefined;

  // If error is 401 and hasn't been retried yet
  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    try {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      
      // Update token in localStorage
      localStorage.setItem('token', newToken);
      
      // Update Authorization header
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      
      // Retry the original request
      return await axiosInstance.request(originalRequest);
    } catch (refreshError) {
      // If refresh token is invalid, log out user
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth';
      throw refreshError;
    }
  }

  return Promise.reject(error);
};