import React from "react";
import { AllCards, ComponentLoading } from "../../components";
import { useGetIngredientsQuery } from "../../features/ingredient/ingredientApiSlice"; // Ensure you have this query defined
import useAuth from "../../hooks/useAuth";

const SavedIngredients = () => {
  const { data, isLoading } = useGetIngredientsQuery();
  const user = useAuth();

  // Filter the ingredients based on the user's favorites
  const updatedData = data?.filter((obj) =>
    user?.favorites?.includes(obj._id.toString())
  );

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Your Favorite Ingredients"}
          tagline={
            "Welcome to your personal pantry - a collection of your favorite ingredients!"
          }
          type={"ingredient"}
          data={updatedData}
        />
      )}
    </>
  );
};

export default SavedIngredients;
