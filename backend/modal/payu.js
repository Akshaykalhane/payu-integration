// models/Payment.js
// const mongoose = require("mongoose");
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" }, 
    productinfo: { type: String },
    firstname: { type: String },
    email: { type: String },
    phone: { type: String },
    status: { type: String,required:true }, 
    transactionDetails: { type: Object }, 
  },
  { timestamps: true }
);

const PaymentModal = mongoose.model("Payment", paymentSchema);

export default PaymentModal;

