const express = require("express");
const { createOrder, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

// Route to create an order for an ingredient
router
  .route("/")
  .post(
    [verifyJwt, verifyRoles(ROLES_LIST.BasicUser,ROLES_LIST.Admin, ROLES_LIST.ProUser)], 
    createOrder
  );

// Route to get all orders (admin access only)
router
  .route("/all")
  .get(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)], 
    getAllOrders
  );

// Route to update order status (admin only)
router
  .route("/status/:orderId")
  .patch(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)], 
    updateOrderStatus
  );

module.exports = router;
