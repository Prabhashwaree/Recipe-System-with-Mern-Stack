import React, { useEffect } from "react";
import { AllCards, ComponentLoading } from "../../components";
import { useDispatch } from "react-redux";
import { setIngredients } from "../../features/ingredient/ingredientSlice"; // Adjust this import based on your slice structure
import { useGetIngredientsQuery } from "../../features/ingredient/ingredientApiSlice"; // Ensure you have this query defined
import useTitle from "../../hooks/useTitle";

const Ingredients = () => {
  const { data, isLoading } = useGetIngredientsQuery();
  const dispatch = useDispatch();
  useTitle("Recipen - All Ingredients");

  useEffect(() => {
    if (!isLoading) {
      dispatch(setIngredients(data)); // Ensure you have a setIngredients action in your ingredientSlice
    }
  }, [isLoading, data, dispatch]);

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Manage Your Ingredients"}
          tagline={
            "Explore a comprehensive list of ingredients to elevate your cooking experience."
          }
          type={"ingredient"}
          data={data}
        />
      )}
    </>
  );
};

export default Ingredients;
