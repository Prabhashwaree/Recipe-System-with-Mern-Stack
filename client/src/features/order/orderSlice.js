import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: null,
  },
  reducers: {
    setOrder: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;

export const selectCurrentOrders = (state) => state.order.orders;
