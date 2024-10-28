import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../config/axios';
import { AxiosError } from 'axios';

interface QueryParams {
  url: string;
  params?: Record<string, any>;
}

// Custom query function with Axios inside each endpoint
const axiosBaseQuery: BaseQueryFn<QueryParams, unknown, unknown> = async ({
  url,
  params,
}) => {
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
};

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: axiosBaseQuery,
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
