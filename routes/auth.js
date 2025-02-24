const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
      console.log("📩 Received Register Request:", req.body);

      const { username, email, password } = req.body;

      if (!username || !email || !password) {
          console.log("⚠️ Missing Fields");
          return res.status(400).json({ error: "All fields are required" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      console.log("✅ User Registered:", newUser);
      res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
      console.error("❌ Registration Error:", error);
      res.status(500).json({ error: "Error registering user", details: error.message });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;