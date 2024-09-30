import { apiSlice } from "../../redux/apiSlice";

export const ingredientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIngredient: builder.query({
      query: (ingredientId) => `/ingredient/${ingredientId}`,
      providesTags: ["ingredients"],
    }),
    getIngredients: builder.query({
      query: () => "/ingredient",
      providesTags: ["ingredients"],
    }),
    addIngredient: builder.mutation({
      query: (ingredientData) => ({
        url: "/ingredient",
        method: "POST",
        body: { ...ingredientData },
      }),
      invalidatesTags: ["ingredients"],
    }),
    updateIngredient: builder.mutation({
      query: (args) => {
        const { ingredientId, ...ingredientData } = args;
        return {
          url: `/ingredient/${ingredientId}`,
          method: "PUT",
          body: { ...ingredientData },
        };
      },
      invalidatesTags: ["ingredients"],
    }),
    deleteIngredient: builder.mutation({
      query: (ingredientId) => ({
        url: `/ingredient/${ingredientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ingredients"],
    }),
    rateIngredient: builder.mutation({
      query: (args) => {
        const { ingredientId, rating } = args;
        return {
          url: `/ingredient/rate/${ingredientId}`,
          method: "PUT",
          body: { rating },
        };
      },
      invalidatesTags: ["ingredients"],
    }),
    commentIngredient: builder.mutation({
      query: (args) => {
        const { ingredientId, comment } = args;
        return {
          url: `/ingredient/comment/${ingredientId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: ["ingredients"],
    }),
    deleteCommentIngredient: builder.mutation({
      query: (args) => {
        const { ingredientId, commentId } = args;
        return {
          url: `/ingredient/comment/${ingredientId}/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ingredients"],
    }),
  }),
});

export const {
  useGetIngredientQuery,
  useGetIngredientsQuery,
  useAddIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
  useRateIngredientMutation,
  useCommentIngredientMutation,
  useDeleteCommentIngredientMutation,
} = ingredientApiSlice;
