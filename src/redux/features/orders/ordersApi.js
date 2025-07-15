// frontend/src/redux/features/orders/orderApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: "include",
    prepareHeaders: (headers, { endpoint }) => {
      // always grab both tokens
      const userToken = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");

      // admin‐only endpoints:
      if (endpoint === "getAllOrders" || endpoint === "updateOrderStatus") {
        if (adminToken) {
          headers.set("authorization", `Bearer ${adminToken}`);
        }
      } else {
        // all other (user) endpoints:
        if (userToken) {
          headers.set("authorization", `Bearer ${userToken}`);
        }
      }

      return headers;
    },
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    // For regular users: create an order
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
    }),

    // For regular users: get own orders by email
    getOrderByEmail: builder.query({
      query: (email) => `/email/${email}`,
      providesTags: ["Orders"],
    }),

    // Admin only: fetch all orders
    getAllOrders: builder.query({
      query: () => "/",
      providesTags: ["Orders"],
    }),

    // Admin only: update an order's status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/${orderId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByEmailQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;

export default ordersApi;
