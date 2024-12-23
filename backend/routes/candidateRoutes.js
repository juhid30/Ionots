// const express = require("express");
// const router = express.Router();
// // const { protect, isCandidate } = require("../middlewares/authMiddleware");
// const projectController = require("../controllers/projectController");
// const { User } = require("../models/userModel");

// // Candidate dashboard - view assigned projects
// router.get("/dashboard", async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("projects");
//     res.status(200).json(user.projects);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Update progress of a project (Candidate only)
// router.put(
//   "/:projectId/update-progress",

//   projectController.updateProgress
// );

// module.exports = router;
