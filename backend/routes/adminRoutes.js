// const express = require("express");
// const router = express.Router();
// // const { protect, isAdmin } = require("../middlewares/authMiddleware");
// const projectController = require("../controllers/projectController");
// const { User } = require("../models/userModel");
// const { Project } = require("../models/projectModel");

// // Admin dashboard - manage all projects and candidates
// router.get("/dashboard", async (req, res) => {
//   try {
//     const projects = await Project.find();
//     const users = await User.find();
//     res.status(200).json({ projects, users });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Create a project (Admin only)
// router.post("/create-project", projectController.addTask);

// // Assign project to a user (Admin only)
// router.post("/assign-project", projectController.assignProject);

// // Delete a project (Admin only)
// router.delete("/delete-project/:id", projectController.deleteProject);

// module.exports = router;
