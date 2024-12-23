const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "candidate"], required: true }, // role: admin or candidate
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // Projects assigned to the candidate
  status: { type: String, enum: ["active", "inactive"], default: "active" }, // Status of the user
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
