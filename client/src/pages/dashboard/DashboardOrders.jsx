import React, { useEffect } from "react";
import { ComponentLoading, Table } from "../../components";
import { setOrder } from "../../features/order/orderSlice";
import { useDispatch } from "react-redux";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../features/order/orderApiSlice";
import { Avatar as MuiAvatar } from "@mui/material";

const DashboardOrders = () => {
  const { data, isLoading } = useGetOrdersQuery();
  const dispatch = useDispatch();

  // Map order data with IDs
  const updatedData = data?.map((order, index) => ({
    ...order,
    id: index + 1,
  }));

  const [changeOrderStatus] = useUpdateOrderStatusMutation();

  const handleDone = (_id) => {
    if (window.confirm("Are you sure you want to mark this order as completed?")) {
      changeOrderStatus({ orderId: _id, status: "Completed" });
    }
  };

  const handleCancel = (_id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      changeOrderStatus({ orderId: _id, status: "Cancelled" });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setOrder(data));
    }
  }, [isLoading, data, dispatch]);

  const cols = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "customer",
      headerName: "Customer",
      width: 280,
      headerAlign: "center",
      align: "left",
      renderCell: ({ row: { user } }) => (
        <div className="flex gap-2 items-center">
          <MuiAvatar
            alt={user?.name}
            src={user?.profilePicture}
            sx={{ width: 36, height: 36 }}
            className="border-2 border-[#5DBF0F]"
          />
          {user?.name}
        </div>
      ),
    },
    {
        field: "email",
        headerName: "Email",
        width: 230,
        headerAlign: "center",
        align: "left",
        renderCell: ({ row: { user } }) => user?.email,
    },
    {
      field: "ingredient",
      headerName: "Ingredient",
      width: 180,
      headerAlign: "center",
      align: "left",
      renderCell: ({ row: { ingredient } }) => ingredient?.title,
    },
    // {
    //   field: "quantity",
    //   headerName: "Quantity",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: ({ row: { quantity } }) => quantity,
    // },
    {
      field: "totalAmount",
      headerName: "Total Price",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { totalPrice } }) => `LKR ${totalPrice}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { status } }) => status,
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { orderDate } }) =>
        new Date(orderDate).toLocaleDateString(),
    },
    {
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
      renderCell: ({ row: { _id, status } }) => {
        if (status === "Pending") {
          return (
            <div className="flex gap-2 justify-center">
              <div
                className="rounded shadow-md  text-center cursor-pointer bg-[#5DBF0F]
                hover:bg-[#5DBF0F] text-light py-2"
                onClick={() => handleDone(_id)}
              >
                Done
              </div>
              <div
                className="rounded shadow-md  text-center cursor-pointer bg-[#FF4D4D]
                hover:bg-[#FF4D4D] text-light py-2"
                onClick={() => handleCancel(_id)}
              >
                Cancel
              </div>
            </div>
          );
        }
        return null; // No buttons for "Completed" or "Cancelled"
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

export default DashboardOrders;
