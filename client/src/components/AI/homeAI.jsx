import React, { useState } from "react";
import { ComponentLoading } from "..";
import { toast } from "react-toastify";
import LinearProgress from "@mui/material/LinearProgress";
import uploadImage from "../../common/uploadImage";
import { photo } from "../../assets";
import { usePredictRecipeMutation } from "../../features/recipe/recipeAIApiSlice";

const HomeAI = ({ isLoading }) => {
  const [formDetails, setFormDetails] = useState({
    image: "",
  });
  const [progress, setProgress] = useState(0);
  const [predictedRecipe, setPredictedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const [predictRecipe] = usePredictRecipeMutation();

  const handleChange = (e) => {
    if (e.target.id === "image") {
      const file = e.target.files[0];
      if (file) {
        setFormDetails({ ...formDetails, image: URL.createObjectURL(file) });
        uploadImageToAI(file);
      }
    }
  };

  const uploadImageToAI = async (file) => {
    setLoading(true);
    setProgress(50);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await predictRecipe(formData).unwrap();
      setPredictedRecipe(result);
      setLoading(false);
      setProgress(100);
      toast.success("Recipe predicted successfully!");
    } catch (error) {
      toast.error(error.data.error);
      setPredictedRecipe(null);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <section className="box mt-28 flex flex-col items-center gap-6">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-3xl font-bold capitalize">
              AI Food Image Recipe Finder
            </h2>
          </div>
          <hr className="w-full" />
          {/* AI Recipe Prediction Section */}
          <section className="my-10 p-6 border rounded-md shadow-lg">
            <div className="basis-1/3 rounded-xl shadow-md hover:shadow-[#5DBF0F] hover:shadow flex justify-center items-center w-full p-8 max-h-[300px]">
              <label
                htmlFor="image"
                className="font-bold cursor-pointer flex flex-col justify-center items-center w-full"
              >
                <div
                  className={
                    formDetails.image ? "w-[40%] mb-2" : "w-[30%] mb-6"
                  }
                >
                  {progress > 0 && progress < 100 ? (
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      color="warning"
                    />
                  ) : (
                    <img
                      src={formDetails.image || photo} // Replace 'photo' with default image path
                      alt="upload photo"
                      className="w-[500px] "
                    />
                  )}
                </div>
                <p className="text-center">
                  Drag your image here, or
                  <span className="text-[#5DBF0F]"> browse</span>
                </p>
              </label>
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleChange}
                accept="image/*"
              />
            </div>

            {loading && (
              <p className="mt-4 text-yellow-500">
                Predicting recipe, please wait...
              </p>
            )}

            {predictedRecipe && (
              <div className="mt-6">
                <h3 className="font-bold text-2xl mb-6 text-center">
                  Predicted Recipe: {predictedRecipe.name}
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Recipe Ingredients */}
                  <div className="basis-1/3 flex flex-col gap-4 border-b-2 md:border-b-0 pb-4 md:pb-0 md:border-r-2 border-gray-200 items-center">
                    <h3 className="font-bold text-2xl">Ingredients</h3>
                    <ol className="flex flex-col gap-2 list-decimal ml-5">
                      {predictedRecipe.ingredients?.map((item, i) => (
                        <li key={`ingredient-${i + 1}`}>{item}</li>
                      ))}
                    </ol>
                  </div>
                  {/* Recipe Instructions */}
                  <div className="basis-2/3 flex flex-col gap-4">
                    <h3 className="font-bold text-2xl">Instructions</h3>
                    <ul className="ml-2 flex flex-col gap-4">
                      {predictedRecipe.instructions?.map((instruction, i) => (
                        <li key={`instruction-${i + 1}`}>
                          <h4 className="font-bold text-xl">Step {i + 1}</h4>
                          <p className="ml-2">{instruction}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>
      )}
    </>
  );
};

export default HomeAI;
