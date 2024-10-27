import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../config/axios';
import { AxiosError } from 'axios';

// Custom query function with Axios inside each endpoint
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: async ({ url, params }) => {
    try {
      const { data } = await axiosInstance.get(url, { params });
      return { data };
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  },
  endpoints: (builder) => ({
    getProducts: builder.query<
      any[],
      { searchQuery?: string; category?: string }
    >({
      query: ({ searchQuery = '', category = 'All' }) => ({
        url: '/products',
        params: {
          q: searchQuery,
          category: category === 'All' ? undefined : category,
        },
      }),
    }),
  }),
});

// Export the auto-generated hook for querying products
export const { useGetProductsQuery } = productApi;
