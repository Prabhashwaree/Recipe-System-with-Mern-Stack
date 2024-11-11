import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "../features/auth/authSlice";
import blogReducer from "../features/blog/blogSlice";
import recipeReducer from "../features/recipe/recipeSlice";
import ingredientReducer from '../features/ingredient/ingredientSlice';
import orderReducer from '../features/order/orderSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    blog: blogReducer,
    recipe: recipeReducer,
    ingredient:ingredientReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
});
