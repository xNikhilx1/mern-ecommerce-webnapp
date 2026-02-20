const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const crypto = require("crypto");
const auth = require("./middleware/auth");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();

/* ================= CORS CONFIGURATION ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-ecommerce-webnapp.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

/* ================= RAZORPAY ================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= RESEND ================= */
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials ❌" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

/* ================= PRODUCTS ================= */
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/* ================= CREATE PAYMENT ================= */
app.post("/create-payment-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Payment creation failed ❌" });
  }
});

/* ================= VERIFY PAYMENT ================= */
app.post("/verify-payment", auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const userId = req.user.id;

    let totalAmount = 0;
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(400).json({ message: "Product not found ❌" });

      totalAmount += product.price * item.quantity;
    }

    /* ================= COD ================= */
    if (paymentMethod === "COD") {
      const newOrder = new Order({
        userId,
        products,
        totalAmount,
        shippingAddress,
        paymentStatus: "Pending",
        orderStatus: "Processing",
        paymentMethod: "Cash on Delivery",
      });

      await newOrder.save();
      return res.json({ message: "COD Order placed ✅" });
    }

    /* ================= RAZORPAY ================= */
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Payment verification failed ❌" });
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentStatus: "Paid",
      orderStatus: "Processing",
      paymentId: razorpay_payment_id,
      paymentMethod: "Razorpay",
    });

    await newOrder.save();

    /* ================= EMAIL ================= */
    if (resend) {
      const user = await User.findById(userId);

      const htmlContent = `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Order Confirmation</h2>
          <p>Hi ${user.name},</p>
          <p>Your order has been successfully placed.</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <hr/>
          <p>Thank you for shopping with WebnApp ❤️</p>
        </div>
      `;

      await resend.emails.send({
        from: "WebnApp <onboarding@resend.dev>",
        to: user.email,
        subject: "Your Order Confirmation - WebnApp",
        html: htmlContent,
      });
    }

    res.json({ message: "Order placed successfully ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

/* ================= MY ORDERS ================= */
app.get("/my-orders", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
