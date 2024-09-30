import React, { useEffect, useState } from "react";
import { Button, ComponentLoading } from "../../components";
import { toast } from "react-toastify";
import {
  useGetIngredientQuery,
  useUpdateIngredientMutation,
} from "../../features/ingredient/ingredientApiSlice";
import { useParams } from "react-router-dom";
import uploadImage from "../../common/uploadImage";

const EditIngredient = () => {
  const { id } = useParams();

  const { data, ...rest } = useGetIngredientQuery(id);
  const [updateIngredient, { isLoading }] = useUpdateIngredientMutation();

  const [formDetails, setFormDetails] = useState({
    title: data?.title || "",
    image: data?.image || "",
    description: data?.description || "",
    quantity: data?.quantity || "",
    price: data?.price || "",
  });

  const [progress, setProgress] = useState(0);
  const [focused, setFocused] = useState({
    title: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (!rest?.isLoading) {
      setFormDetails({
        title: data?.title,
        image: data?.image,
        description: data?.description,
        quantity: data?.calories,
        price: data?.cookingTime,
      });
    }
  }, [rest?.isLoading]);

  const handleFocus = (e) => {
    setFocused({ ...focused, [e.target.id]: true });
  };

  const handleChange = (e) => {
    if (e.target.id === "image") {
      uploadImage(e, setProgress, setFormDetails, formDetails);
    } else {
      setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formDetails.image) return toast.error("Upload ingredient image");

    try {
      const ingredient = await toast.promise(
        updateIngredient({ ...formDetails, ingredientId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Ingredient updated successfully",
          error: "Unable to update Ingredient",
        }
      );
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  return (
    <section className="box flex flex-col gap-6">
      <h2 className="font-bold text-xl">Edit Ingredient</h2>
      <hr />
      {rest.isLoading ? (
        <ComponentLoading />
      ) : (
        <form
          className="flex flex-col-reverse md:flex-row gap-4 mt-10 justify-around"
          onSubmit={handleSubmit}
        >
          <div className="basis-1/2 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="title"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Ingredient name
              </label>
              <div className="flex flex-col basis-1/2">
                <input
                  type="text"
                  onChange={handleChange}
                  value={formDetails.title}
                  id="title"
                  name="title"
                  onBlur={handleFocus}
                  focused={focused.title.toString()}
                  pattern={"^.{3,}$"}
                  required
                  aria-required="true"
                  aria-describedby="title-error"
                  placeholder="Enter ingredient name"
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-[#5DBF0F]"
                />
                <span
                  id="title-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Name should at least 3 characters long
                </span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="description"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Ingredient description
              </label>
              <div className="flex flex-col basis-1/2">
                <textarea
                  type="text"
                  onChange={handleChange}
                  value={formDetails.description}
                  id="description"
                  required
                  name="description"
                  rows="5"
                  aria-required="true"
                  placeholder="Enter your description here..."
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-[#5DBF0F] w-full resize-none"
                ></textarea>
              </div>
            </div>
            <hr />
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="quantity"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Ingredients Quantity
              </label>
              <div className="flex flex-col basis-1/2">
                <input
                  type="number"
                  onChange={handleChange}
                  value={formDetails.quantity}
                  id="quantity"
                  required
                  name="quantity"
                  onBlur={handleFocus}
                  focused={focused.quantity.toString()}
                  aria-required="true"
                  aria-describedby="quantity-error"
                  placeholder="Enter quantity"
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-[#5DBF0F]"
                />
                <span
                  id="quantity-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Should not include letters or special characters
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="price"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Ingredients Price (Rs)
              </label>
              <div className="flex flex-col basis-1/2">
                <input
                  type="number"
                  onChange={handleChange}
                  value={formDetails.price}
                  id="price"
                  required
                  name="price"
                  onBlur={handleFocus}
                  focused={focused.price.toString()}
                  aria-required="true"
                  aria-describedby="price-error"
                  placeholder="Enter Price"
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-[#5DBF0F]"
                />
                <span
                  id="price-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Should not include letters or special characters
                </span>
              </div>
            </div>
            <Button
               content={"Save changes"}
               type={"submit"}
               customCss={"rounded px-4 py-1 max-w-max"}
               loading={isLoading}
            />
          </div>
          <hr className="block md:hidden mt-6" />
          {/* Upload recipe image */}
          <div className="basis-1/3 rounded-xl shadow-md hover:shadow-[#5DBF0F] hover:shadow flex justify-center items-center w-full p-8 max-h-[300px]">
            <label
              htmlFor="image"
              className="font-bold cursor-pointer flex flex-col justify-center items-center w-full"
            >
              <div
                className={formDetails.image ? "w-[65%] mb-2" : "w-[30%] mb-6"}
              >
                {progress > 0 && progress < 100 ? (
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color="warning"
                  />
                ) : (
                  <img
                    src={formDetails.image || photo}
                    alt="upload photo"
                    className="w-full "
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
            />
          </div>
        </form>
      )}
    </section>
  );
};

export default EditIngredient;
