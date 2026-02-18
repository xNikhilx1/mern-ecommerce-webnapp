const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully ✅"))
  .catch((err) => console.log("MongoDB Connection Error ❌", err));

// ================= RAZORPAY SETUP =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= NODEMAILER SETUP =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // important for Render
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================= TEST EMAIL ROUTE =================
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from WebnApp",
      text: "If you received this email, Nodemailer is working correctly!",
    });

    res.send("Test email sent successfully ✅");
  } catch (error) {
    console.log("Email error ❌", error);
    res.status(500).send("Email failed ❌");
  }
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌", error });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌", error });
  }
});

// ================= ADD PRODUCT =================
app.post("/add-product", async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      image,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully ✅",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});

// ================= GET PRODUCTS =================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌", error });
  }
});

// ================= PLACE ORDER =================
app.post("/place-order", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { products } = req.body;

    let totalAmount = 0;

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found ❌" });
      }
      totalAmount += product.price * item.quantity;
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentStatus: "Paid",
    });

    await newOrder.save();

    // 🔥 SEND EMAIL TO USER
    const user = await User.findById(userId);

    if (user) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Order Confirmation 🛒 - WebnApp",
        text: `
Hi ${user.name},

Your order has been placed successfully!

Order ID: ${newOrder._id}
Total Amount: ₹${totalAmount}

Thank you for shopping with WebnApp!

- Nikhil
`,
      });
    }

    res.status(201).json({
      message: "Order placed successfully ✅",
      order: newOrder,
    });
  } catch (error) {
    console.log("Order Error ❌", error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});

// ================= CREATE RAZORPAY ORDER =================
app.post("/create-payment-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Payment creation failed ❌", error });
  }
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
