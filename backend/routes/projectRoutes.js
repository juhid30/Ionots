const express = require("express");
const {
  assignProject,
  updateProgress,
  getAssignedProjects,
  addProject,
  addTask,
  acceptRejectProject,
  markTaskAsCompleted,
  viewProjects,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", viewProjects);
router.post("/add", addProject);
router.post("/add-task", addTask);
router.post("/assign", assignProject);
router.post("/accept-reject", authMiddleware, acceptRejectProject);
router.post("/:id/progress", updateProgress);
router.get("/assigned", authMiddleware, getAssignedProjects);
router.post("/:projectId/task/:taskId/complete", markTaskAsCompleted);

module.exports = router;
