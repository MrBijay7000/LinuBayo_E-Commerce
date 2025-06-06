const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { check } = require("express-validator");

const orderController = require("../controllers/order-controllers");

router.post(
  "/",
  auth,
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("address", "Address is required").not().isEmpty(),
    check("paymentMethod", "Payment method is required").not().isEmpty(),
    check("items", "Order items are required").isArray({ min: 1 }),
    check("totalAmount", "Total amount is required").isNumeric(),
  ],
  orderController.createOrder
);

router.get("/allOrder", auth, orderController.getAllOrders);

router.get("/:id", orderController.getOrderById);
// router.get("/user/:userId", orderController.getUserIdOrder);
// In your order-routes.js
router.get("/user/:userId", orderController.getOrdersByUserId);
router.patch("/:orderId", auth, orderController.updateOrderStatus);

module.exports = router;
