import { apiSlice } from "../../redux/apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    orderIngredient: builder.mutation({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        body: { ...orderData },
      }),
      invalidatesTags: ["Order"],
    }),
    getOrders: builder.query({
      query: () => ({
        url: "/order/all",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    // Endpoint for updating order status (admin only)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/status/${orderId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useOrderIngredientMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApiSlice;
