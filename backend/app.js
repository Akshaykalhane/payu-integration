import express from "express";
import PayU from "payu-websdk";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Payment from "./modal/payu.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));


const payuClient = new PayU(
  {
    key: process.env.MERCHANT_KEY,
    salt: process.env.MERCHANT_SALT,
  },
  process.env.MERCHANT_MODE
);

app.post("/initiate-payment", async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email, phone } = req.body;

    let data = {
      isAmountFilledByCustomer: false,
      key:process.env.MERCHANT_KEY,
      txnid,
      amount,
      currency: 'USD',
      productinfo,
      firstname,
      email,
      phone,
      surl: `http://localhost:3000/verify/${txnid}`,
      furl: `http://localhost:3000/verify/${txnid}`,
    };

    console.log(data);


    const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${data.currency}|${process.env.MERCHANT_SALT}`;
    
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    data.hash = hash;

    let response = await payuClient.paymentInitiate(data);

    // const payment = new Payment({
    //   txnid,
    //   amount,
    //   status:"initiated",
    //   email,
    //   phone,
    //   currency:data.currency,
    //   productinfo
    // })

    // await payment.save();


    console.log(response);

    res.send(response);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).send(error);
  }
});

app.post("/verify/:id", async (req, res) => {
  console.log("comes for verify")
  try {
    const data = await payuClient.verifyPayment(req.params.id);
    const status = data.transaction_details[req.params.id];
    console.log(status,'status data')
    let txnid = req.params.id;
    

    if (status.status === "success") {
    
      // await Payment.updateOne({txnid},{
      //   status:status.status,
      // });

      res.redirect("http://localhost:5173/status?status=success");
    } else {
      res.redirect("http://localhost:5173/status?status=fail");
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
