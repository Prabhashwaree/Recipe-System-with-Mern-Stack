import React from "react";
import { AllCards, ComponentLoading } from "../../components";
import { useGetIngredientsQuery } from "../../features/ingredient/ingredientApiSlice";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const index = () => {
  const { data, isLoading } = useGetIngredientsQuery();
  
  const user = useAuth();
  useTitle("Recipen - My Ingredients");
  console.log(data, user?.userId);

  // Filter ingredients based on the logged-in user's ID
  const updatedData = data?.filter((obj) => obj.vendor._id === user?.userId);

  return (
    <>
      {isLoading ? (    
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Your Original Ingredients"}
          tagline={
            "Welcome to your dedicated space where you can manage your ingredients."
          }
          type={"ingredient"}
          data={updatedData}
        />
      )}
    </>
  );
};

export default index;
