import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "../features/auth/authSlice";
import blogReducer from "../features/blog/blogSlice";
import recipeReducer from "../features/recipe/recipeSlice";
import ingredientReducer from '../features/ingredient/ingredientSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    blog: blogReducer,
    recipe: recipeReducer,
    ingredient:ingredientReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
});
