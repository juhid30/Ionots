const { Project } = require("../models/projectModel");
const { User } = require("../models/userModel");

exports.viewProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("assignedTo");
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve projects" });
  }
};

// Add a new project
exports.addProject = async (req, res) => {
  const { title, description, deadline, assignedTo } = req.body;

  try {
    // Create a new project
    const newProject = new Project({
      title,
      description,
      deadline,
      assignedTo: assignedTo || null, // Default to null if no user is assigned yet
      status: "pending", // Default project status
      tasks: [],
      progress: [],
    });

    await newProject.save();

    // If the project is assigned to a user, update the user's projects array
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      user.projects.push(newProject._id);
      await user.save();
    }

    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Assign a project to a candidate (User with role 'candidate')
// Assign a project to a candidate (User with role 'candidate')
exports.assignProject = async (req, res) => {
  const { projectId, userId } = req.body; // userId will be a candidate
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Assign the project to the candidate (initially as pending)
    project.assignedTo = userId;
    project.status = "pending"; // Default to "pending" when initially assigned
    await project.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send response to the admin about successful assignment
    res.status(200).json({ message: "Project assigned successfully", project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Candidate accepts or rejects a project
exports.acceptRejectProject = async (req, res) => {
  const { projectId, decision } = req.body; // userId is the candidate, and decision is 'accept' or 'reject'
  const userId = req.user._id;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the project is already assigned, check the candidate's decision
    if (project.assignedTo.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "This project is not assigned to the user" });
    }

    // Handle acceptance or rejection
    if (decision === "accept") {
      // Add project to user's projects array and mark as completed
      user.projects.push(projectId);
      project.status = "in-progress"; // Mark project as completed
    } else if (decision === "reject") {
      // Do not add project to user's array, mark it as declined
      project.status = "declined";
    } else {
      return res
        .status(400)
        .json({ error: "Invalid decision, must be 'accept' or 'reject'" });
    }

    // Save the project and user changes
    await user.save();
    await project.save();

    res.status(200).json(project); // Return updated project
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a new task to a project
exports.addTask = async (req, res) => {
  const { projectId, task } = req.body;

  // Validate task structure
  if (!task.name || !task.description) {
    return res
      .status(400)
      .json({ error: "Task name and description are required." });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Push the new task into the project's tasks array
    project.tasks.push(task);
    await project.save();

    // Respond with the updated project
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update progress of a project
exports.updateProgress = async (req, res) => {
  const { taskId, score } = req.body;
  try {
    const project = await Project.findById(req.params.projectId);
    const task = project.tasks.id(taskId);

    // Update task's score and status
    task.score = score;
    if (score > 0) {
      task.status = "in-progress"; // Automatically mark it as in-progress if score is updated.
    } else {
      task.status = "pending"; // Reset status to "pending" if score is cleared (optional).
    }

    // Log progress
    project.progress.push({ taskId, score, updatedAt: Date.now() });

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get all projects assigned to a user (candidate), including those not accepted yet
exports.getAssignedProjects = async (req, res) => {
  const userId = req.user._id; // Candidate's user ID
  console.log(userId);
  try {
    // Find all projects where the assignedTo field matches the userId
    const projects = await Project.find({ assignedTo: userId });
    console.log(projects);
    // Respond with an empty array if no projects are found
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Mark a task as completed
exports.markTaskAsCompleted = async (req, res) => {
  const { projectId, taskId } = req.params;

  try {
    // Find the project by its ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Find the task in the project's tasks array
    const task = project.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Mark the task as completed
    task.status = "completed";
    // Check if all tasks in the project are completed
    const allTasksCompleted = project.tasks.every(
      (t) => t.status === "completed"
    );

    // If all tasks are completed, update the project's status
    if (allTasksCompleted) {
      project.status = "completed";
    }
    // Save the updated project
    await project.save();

    res.status(200).json({ message: "Task marked as completed", project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
