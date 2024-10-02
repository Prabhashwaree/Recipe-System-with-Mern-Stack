import React from "react";
import {
  Hero,
  HomeCategories,
  Subscribe,
  Button,
  HomeAI,
} from "../../components";
import { useGetRecipesQuery } from "../../features/recipe/recipeApiSlice";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";
import { useGetIngredientsQuery } from "../../features/ingredient/ingredientApiSlice";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const persist = localStorage.getItem("persist");
  const user = useAuth();
  const recipes = useGetRecipesQuery();
  const blogs = useGetBlogsQuery();
  const ingredient = useGetIngredientsQuery();

  return (
    <>
      <Hero />
      <HomeCategories
        title={"recipe"}
        data={recipes?.data}
        isLoading={recipes?.isLoading}
      />
      {persist !== "true" && !user?.roles?.some((role) => role === "ProUser" || role === "Admin") && (
        <Subscribe />
      )}
      <HomeCategories
        title={"blog"}
        data={blogs?.data}
        isLoading={blogs?.isLoading}
      />
      <HomeCategories
        title={"ingredient"}
        data={ingredient?.data}
        isLoading={ingredient?.isLoading}
      />
      <HomeAI isLoading={false} />
    </>
  );
};

export default Home;
