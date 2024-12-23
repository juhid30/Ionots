const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined.");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the newly created user
    res
      .status(201)
      .json({ success: true, user: { id: newUser._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (role != user.role) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }
    // Generate a JWT token for the user after successful login
    const token = jwt.sign({ user, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || "1h",
    });
    res.cookie("token", token);
    console.log(token);
    // Respond with the token and sanitized user info
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const logout = (req, res) => {
  try {
    // Clear the cookie by setting an expired date
    res.clearCookie("token");

    // Respond with a success message
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to log out" });
  }
};

// Fetch all users with the role 'candidate'
const getCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: "candidate" }); // Assuming the User schema has a 'role' field
    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve candidates" });
  }
};

module.exports = { register, login, getCandidates, logout };
