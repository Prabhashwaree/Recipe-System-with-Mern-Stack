import React, { useEffect } from "react";
import { ComponentLoading, Table } from "../../components";
import { setIngredients } from "../../features/ingredient/ingredientSlice";
import { useDispatch } from "react-redux";
import {
  useGetIngredientsQuery,
  useDeleteIngredientMutation,
} from "../../features/ingredient/ingredientApiSlice";
import { Avatar as MuiAvatar, Rating } from "@mui/material";

const DashboardIngredients = () => {
  const { data, isLoading } = useGetIngredientsQuery();

  const dispatch = useDispatch();
  const updatedData = data?.map((item, index) => ({
    ...item,
    id: index + 1,
  }));
  const [deleteIngredient] = useDeleteIngredientMutation();

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteIngredient(_id);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setIngredients(data));
    }
  }, [isLoading]);

  const cols = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "title",
      headerName: "Title",
      width: 280,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "supplier",
      headerName: "Supplier",
      headerAlign: "center",
      align: "left",
      minWidth: 250,
      renderCell: ({ row: { vendor } }) => {
        return (
          <div className="flex gap-2 items-center">
            <MuiAvatar
              alt={vendor?.name}
              src={vendor?.profilePicture}
              sx={{ width: 36, height: 36 }}
              className="border-2 border-[#5DBF0F]"
            />
            {vendor.name}
          </div>
        );
      },
    },
    {
      field: "ratings",
      headerName: "Rating",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { ratings } }) => {
        const sumOfRatings = ratings.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        const averageRating =
          sumOfRatings === 0 ? 0 : sumOfRatings / ratings.length;
        return <Rating value={averageRating} readOnly={true} size={"medium"} />;
      },
    },
    {
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
      renderCell: ({ row: { _id } }) => {
        return (
          <div
            className="rounded shadow-md w-[40%] text-center cursor-pointer  bg-[#5DBF0F]
            hover:bg-[#5DBF0F] text-light py-2"
            onClick={() => handleDelete(_id)}
          >
            Delete
          </div>
        );
      },
    },
  ];

  return (
    <section className="mx-auto px-6 flex justify-center items-center h-[100vh]">
      <div className="w-full h-[90%] flex justify-center items-center">
        {isLoading ? (
          <ComponentLoading />
        ) : (
          <Table rows={updatedData} cols={cols} />
        )}
      </div>
    </section>
  );
};

export default DashboardIngredients;
