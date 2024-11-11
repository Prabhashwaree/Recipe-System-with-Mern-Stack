const Order = require("../models/orderModel");
const Ingredient = require("../models/ingredientsModel");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { ingredientId, quantity,userId } = req.body;
    const ingredient = await Ingredient.findById(ingredientId);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    const totalPrice = ingredient.price * quantity;

    const order = await Order.create({
      user: userId,
      ingredient: ingredientId,
      quantity,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("ingredient", "title price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const validStatuses = ["Pending", "Completed", "Cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      order.status = status;
      await order.save();
  
      res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
      res.status(500).json({ message: "Error updating order status", error });
    }
  };

module.exports = { createOrder, getAllOrders, updateOrderStatus  };
