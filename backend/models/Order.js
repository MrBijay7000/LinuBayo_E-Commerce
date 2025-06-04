// server/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "pending" },
  paymentDetails: { type: Object },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingFee: { type: Number, default: 100 },
  orderStatus: { type: String, default: "processing" },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
