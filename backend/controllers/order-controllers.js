const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} = require("../util/emailTemplate");

const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get user details to include in order and for email
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the authenticated user's ID to the order
    const orderData = {
      ...req.body,
      user: req.user.id,
      email: user.email, // Store email with order
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Send order confirmation email (don't await to not block response)
    sendOrderConfirmationEmail(user.email, savedOrder);

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Order saving failed:", err);
    res.status(500).json({
      message: "Placing order failed",
      error: err.message,
    });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
};

const getUserIdOrder = async (req, rex, next) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({
      orderDate: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// In your order-controllers.js
const getOrdersByUserId = async (req, res, next) => {
  try {
    // Validate user ID
    console.log("userId param received:", req.params.userId); //
    if (!req.params.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch orders sorted by date (newest first)
    const orders = await Order.find({ user: req.params.userId })
      .sort({ orderDate: -1 })
      .populate("items.productId"); // Populate product details if needed

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: orders,
      count: orders.length,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "items.productId",
        select: "name image price", // Make sure to include all needed fields
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    sendOrderStatusUpdateEmail(order, status).catch(console.error);
    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

exports.getOrdersByUserId = getOrdersByUserId;

exports.createOrder = createOrder;
exports.getOrderById = getOrderById;
exports.getUserIdOrder = getUserIdOrder;
exports.getAllOrders = getAllOrders;
exports.updateOrderStatus = updateOrderStatus;
