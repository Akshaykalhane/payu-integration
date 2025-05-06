// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" }, 
    productinfo: { type: String },
    firstname: { type: String },
    email: { type: String },
    phone: { type: String },
    status: { type: String }, 
    transactionDetails: { type: Object }, 
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);