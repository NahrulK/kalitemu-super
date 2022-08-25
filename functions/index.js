const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51KyVBgJHCE1fmy6FDKEJmg5EuHK42KRlmURWmC2WuZoFKX2qRKxEjRWfQXtJXfkRHcDJbCy3TFnVUTybD6yDWeTX00T8x6tvm6"
);

const app = express();

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());

app.post("/checkout/step3", async (req, res) => {
  try {
    const { amount, shipping } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      shipping,
      amount,
      currency: "idr",
    });

    res.status(200).send(paymentIntent.client_secret);
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

app.get("*", (req, res) => {
  res.res.status(404).send("404, Not Found.");
});

exports.api = functions
  .runWith({ memory: "2GB", timeoutSeconds: 540 })
  .https.onRequest(app);
