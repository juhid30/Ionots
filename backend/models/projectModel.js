const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  score: { type: Number, default: 0 },
});

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Changed to "User" model
    status: {
      type: String,
      enum: ["pending", "in-progress", "declined", "completed"],
      default: "pending",
    },
    tasks: [taskSchema], // Array of tasks
    progress: [
      {
        taskId: mongoose.Schema.Types.ObjectId,
        score: Number,
        updatedAt: { type: Date, default: Date.now },
      },
    ], // Track progress (no need for status)
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = { Project };
