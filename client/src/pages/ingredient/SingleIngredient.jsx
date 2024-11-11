import React, { useState } from "react";
import {
  Comment,
  Button,
  Input,
  ShareButton,
  NoData,
  ComponentLoading,
} from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { LuChefHat } from "react-icons/lu";
import { LiaIconsSolid } from "react-icons/lia";
import { LiaMoneyBillAlt } from "react-icons/lia";
import { FaRegPaperPlane } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart, AiOutlineUser } from "react-icons/ai";
import {
  useGetIngredientQuery,
  useCommentIngredientMutation,
  useRateIngredientMutation,
  useDeleteCommentIngredientMutation,
  useDeleteIngredientMutation,
} from "../../features/ingredient/ingredientApiSlice"; // Ensure you have this query defined
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { MoreVert } from "@mui/icons-material";
import { Rating, IconButton, Menu, MenuItem } from "@mui/material";
import { useOrderIngredientMutation } from "../../features/order/orderApiSlice";

const SingleIngredient = () => {
  useTitle("Recipen - Ingredient");

  const user = useAuth();
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const { data, ...rest } = useGetIngredientQuery(id);
  const [rateIngredient] = useRateIngredientMutation();
  const [commentIngredient, { isLoading }] = useCommentIngredientMutation();
  const [deleteComment] = useDeleteCommentIngredientMutation();
  const [deleteIngredient] = useDeleteIngredientMutation();

  const [orderIngredient] = useOrderIngredientMutation();

  const [formDetails, setFormDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });

  const sumOfRatings = data?.ratings.reduce(
    (sum, item) => sum + item.rating,
    0
  );
  const averageRating =
    sumOfRatings === 0 ? 0 : sumOfRatings / data?.ratings.length;

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleRating = async (event, newValue) => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin");
      }
      setRating(newValue);
      await toast.promise(
        rateIngredient({ rating: newValue, ingredientId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Rating added successfully",
          error: "You have already rating this ingredient",
        }
      );
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must sign in first");
      return navigate("/auth/signin");
    }
    try {
      await toast.promise(
        commentIngredient({
          ingredientId: id,
          comment: formDetails.message,
        }).unwrap(),
        {
          pending: "Please wait...",
          success: "Comment added",
          error: "Could not add comment",
        }
      );
      setFormDetails({ ...formDetails, message: "" });
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleDeleteComment = async (_id) => {
    try {
      await toast.promise(
        deleteComment({ ingredientId: id, commentId: _id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Comment deleted",
          error: "Could not delete comment",
        }
      );
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuDelete = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteIngredient(data?._id);
      navigate("/recipe");
    }
    setAnchorEl(null);
  };

  const handleBuy = async () => {
    if (!user) {
      toast.error("You must sign in first");
      return navigate("/auth/signin");
    }

    try {
      const orderData = {
        ingredientId: id,
        userId: user.userId,
        quantity: 1, 
      };

      await toast.promise(
        orderIngredient(orderData).unwrap(),
        {
          pending: "Placing order",
          success: "Order placed successfully! Our sales team will contact you soon.",
          error: "Failed to place order",
        }
      );
    } catch (error) {
      toast.error("Could not place order. Please try again later.");
      console.error(error);
    }
    // toast.success(
    //   "Order placed successfully! Our sales team will contact you soon."
    // );
  };

  return (
    <>
      {rest?.isLoading ? (
        <ComponentLoading />
      ) : (
        <section className="box flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Recipe image */}
            <div className="basis-1/3">
              <img
                src={data?.image}
                alt={data?.title}
                className="rounded w-full"
              />
            </div>
            {/* Recipe details */}
            <div className="basis-2/3 flex flex-col gap-2">
              <div className="flex justify-between">
                <h2 className="font-bold text-xl md:text-3xl">{data?.title}</h2>
                {data?.vendor?._id === user?.userId && (
                  <>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? "long-menu" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      size="small"
                      onClick={handleMenu}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        "aria-labelledby": "long-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                    >
                      <MenuItem>
                        <Link to={`/ingredient/edit/${id}`}>Edit</Link>
                      </MenuItem>
                      <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
                    </Menu>
                  </>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="flex gap-2 items-center font-semibold">
                  <LuChefHat className="text-[#5DBF0F]" />
                  {data?.author?.name}
                </p>
                <div className="flex gap-2 p-2 bg-light rounded-l-lg">
                  <ShareButton
                    url={`${import.meta.env.VITE_BASE_URL}/recipe/${data?._id}`}
                  />
                </div>
              </div>
              {/* Recipe rating */}
              <Rating value={averageRating} size={"medium"} readOnly />
              <p className="my-4">{data?.description}</p>
              {/* Recipe time & cals */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between w-2/3 mx-auto">
                <div className="flex flex-col gap-1 items-center">
                  <LiaIconsSolid className="text-5xl text-gray-800" />
                  <h3 className="font-bold text-xl text-[#5DBF0F]">Quantity</h3>
                  <p>{data?.quantity} </p>
                </div>
                <div className="flex flex-col gap-1 items-center text-gray-800">
                  <LiaMoneyBillAlt className="text-5xl" />
                  <h3 className="font-bold text-xl text-[#5DBF0F]">Price</h3>
                  <p>Rs. {data?.price} </p>
                </div>
              </div>
              <Button
                content={"Buy Now"}
                icon={<AiOutlineHeart />}
                customCss={"rounded-lg gap-3 max-w-max mt-4"}
                handleClick={handleBuy}
                loading={isLoading}
              />
            </div>
          </div>
          <hr />
          <hr />
          {/* Rate recipe */}
          {!data?.ratings?.some((obj) => obj.user === user?.userId) && (
            <>
              <div className="my-6 w-full sm:w-2/3 md:w-1/2 mx-auto flex justify-between gap-6">
                <h3 className="font-bold text-2xl">Rate the Ingredient</h3>
                <Rating
                  size={"large"}
                  precision={0.25}
                  value={rating}
                  onChange={handleRating}
                />
              </div>
              <hr />
            </>
          )}
          {/* Recipe comment form */}
          <div className="my-10 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Leave a Reply</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                type={"text"}
                id={"name"}
                icon={<AiOutlineUser color="#5DBF0F" />}
                handleChange={handleChange}
                value={formDetails.name}
                label={"Name"}
                placeholder={"John Doe"}
              />
              <Input
                type={"email"}
                id={"email"}
                icon={<IoMailOutline color="#5DBF0F" />}
                handleChange={handleChange}
                value={formDetails.email}
                label={"Email"}
                placeholder={"example@abc.com"}
              />
              <div className="flex flex-col relative ">
                <label htmlFor="message" className="text-sm font-semibold mb-3">
                  Comment
                </label>
                <textarea
                  onChange={handleChange}
                  value={formDetails.message}
                  id="message"
                  rows={4}
                  required
                  aria-required="true"
                  placeholder="Leave a comment..."
                  className="py-2 px-4 border bg-gray-100 rounded-lg focus:outline outline-[#5DBF0F]"
                />
              </div>
              <Button
                content={"Post comment"}
                icon={<FaRegPaperPlane />}
                type={"submit"}
                customCss={"rounded-lg gap-3 max-w-max"}
                loading={isLoading}
              />
            </form>
          </div>
          <hr />
          {/* Recipe comments */}
          <div className="w-full sm:w-4/5 mx-auto flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Comments</h3>
            {data?.comments?.length ? (
              <div className="flex flex-col gap-6">
                {data?.comments?.map((comment) => (
                  <Comment
                    key={comment?._id}
                    comment={comment}
                    userId={user?.userId}
                    handleDeleteComment={handleDeleteComment}
                  />
                ))}
              </div>
            ) : (
              <NoData text={"Comments"} />
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default SingleIngredient;
