import { apiSlice } from "../../redux/apiSlice";

export const orderApiSlice  = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    orderIngredient: builder.mutation({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        body: { ...orderData },
      }),
      invalidatesTags: ["Order"], 
    }),
  }),
});

export const { useOrderIngredientMutation } = orderApiSlice; 
