import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define your API slice
export const recipeAIApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:5000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
   
    predictRecipe: builder.mutation({
      query: (formData) => ({
        url: '/predict-recipe',
        method: 'POST',
        body: formData, 
      }),
    }),
  }),
});


export const { usePredictRecipeMutation } = recipeAIApiSlice;
