import express from "express";
import PayU from "payu-websdk";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

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
      txnid,
      amount,
      currency: "INR",
      productinfo,
      firstname,
      email,
      phone,
      surl: `http://localhost:3000/verify/${txnid}`,
      furl: `http://localhost:3000/verify/${txnid}`,
    };

    console.log(data);

    const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    data.hash = hash;

    let response = await payuClient.paymentInitiate(data);

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
    if (status.status === "success") {
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
