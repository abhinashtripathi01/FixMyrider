const express = require("express");
const router = express.Router();
var request = require("request");
const verifyJWT = require("../middleware/verifyJWT");
const OrderSchema = require("../models/OrderSchema");

router.post("/create", verifyJWT, async (req, res) => {
  const { orderId, orderName, amount, paymentMethod } = req.body;
  // Validate required fields
  if (!orderId || !amount || !paymentMethod) {
    return res
      .status(400)
      .json({ message: "Required fields are missing.", success: false });
  }

  try {
    var options = {
      method: "POST",
      url: `${process.env.KHALTI_ENDPOINT}/epayment/initiate/`,
      headers: {
        Authorization: "key 2566452e555f4005a42a41da53ff2aa2",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: `${process.env.API_URL}/api/payment/verify`,
        website_url: "http://localhost:3000",
        amount: amount,
        purchase_order_id: orderId,
        purchase_order_name: orderName,
      }),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      const parsedResponse = JSON.parse(response?.body);
      if (parsedResponse.payment_url) {
        res.status(201).json({
          paymentUrl: parsedResponse.payment_url,
          success: true,
        });
      } else {
        res.status(400).json({
          message: parsedResponse?.detail,
          success: false,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment Failed.", error, success: false });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const { pidx, amount, purchase_order_id, message } = req.query;
    if (message) {
      return res.status(400).json({
        success: false,
        message,
      });
    }
    var options = {
      method: "POST",
      url: `${process.env.KHALTI_ENDPOINT}/epayment/lookup/`,
      headers: {
        Authorization: "key 2566452e555f4005a42a41da53ff2aa2",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pidx,
      }),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      const parsedResponse = JSON.parse(response?.body);
      console.log(parsedResponse);
      if (parsedResponse.status === "Completed") {
        OrderSchema.findById(purchase_order_id).then((order) => {
          order.paid = true;
          order
            .save()
            .then(() => res.redirect("http://localhost:3000/my-orders"))
            .catch((err) => res.status(400).json("Error: " + err));
        });
      } else {
        res.status(400).json({
          //   message: parsedResponse?.detail,
          success: false,
        });
      }
    });
  } catch (e) {
    res.status(500).json({ message: "Payment Failed.", error, success: false });
  }
});

module.exports = router;
