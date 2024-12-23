import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "./DashboardHeader";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    score: "",
  });
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "", // Optional now
  });
  const [candidateAssignment, setCandidateAssignment] = useState({
    projectId: null,
    candidateId: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/projects/")
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });

    axios
      .get("http://localhost:5000/api/auth/candidates")
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  const openModal = (projectId) => {
    setSelectedProject(projectId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskData({ name: "", description: "", score: "" }); // Reset task form
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    const { name, description, score } = taskData;

    if (name && description && score && selectedProject) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/projects/add-task",
          {
            projectId: selectedProject,
            task: {
              name,
              description,
              score,
            },
          }
        );

        // Update the projects state with the new task
        const updatedProjects = projects.map((project) => {
          if (project._id === selectedProject) {
            return { ...project, tasks: response.data.tasks };
          }
          return project;
        });

        setProjects(updatedProjects);
        closeModal(); // Close the modal after adding the task
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (event) => {
    event.preventDefault();
    const { title, description, deadline, assignedTo } = newProject;

    if (title && description && deadline) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/projects/add",
          {
            title,
            description,
            deadline,
            assignedTo: assignedTo || null, // Assign null if no candidate selected
          }
        );
        const assignedCandidate = candidates.find(
          (candidate) => candidate._id === response.data.assignedTo
        );

        if (assignedCandidate) {
          response.data.assignedTo = assignedCandidate; // Populate the assignedTo with the full candidate data
        }

        setProjects([...projects, response.data]);
        setNewProject({
          title: "",
          description: "",
          deadline: "",
          assignedTo: "",
        });
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  const handleTaskChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleAssignCandidate = async (event) => {
    event.preventDefault();
    const { projectId, candidateId } = candidateAssignment;

    if (candidateId) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/projects/assign`,
          { projectId, userId: candidateId }
        );

        const updatedProjects = projects.map((project) => {
          if (project._id === projectId) {
            return { ...project, assignedTo: response.data.project.assignedTo };
          }
          return project;
        });

        setProjects(updatedProjects);
        setCandidateAssignment({ projectId: null, candidateId: "" });
      } catch (error) {
        console.error("Error assigning candidate:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200  to-green-100 p-6">
      <DashboardHeader title="Admin Dashboard" />

      {/* Add Project Form */}
      <div className="w-full max-w-lg mb-8">
        <form
          onSubmit={handleAddProject}
          className="bg-white shadow-xl rounded-lg p-8 space-y-6 transform transition-all hover:shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400 mb-4">
            Add Project
          </h2>
          <input
            type="text"
            name="title"
            value={newProject.title}
            onChange={handleProjectChange}
            placeholder="Project Title"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="description"
            value={newProject.description}
            onChange={handleProjectChange}
            placeholder="Project Description"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          <input
            type="date"
            name="deadline"
            value={newProject.deadline}
            onChange={handleProjectChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            name="assignedTo"
            value={newProject.assignedTo}
            onChange={handleProjectChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Candidate (Optional)</option>
            {candidates.map((candidate) => (
              <option key={candidate._id} value={candidate._id}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-teal-600 text-white py-3 px-4 rounded-lg"
          >
            Add Project
          </button>
        </form>
      </div>

      {/* Display Projects */}
      <div className="w-full max-w-7xl mt-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-600 mb-7">
          Projects Overview
        </h2>
        <ul className="space-y-8">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl"
            >
              {/* Project Title */}
              <h3 className="text-2xl font-extrabold text-blue-800">
                {project.title}
              </h3>

              {/* Assigned To Information */}
              <p className="text-gray-700 text-lg mb-4">
                Assigned To:{" "}
                {project.assignedTo ? project.assignedTo.name : "Not Assigned"}
              </p>

              {/* Tasks Section */}
              <div className="mt-4">
                <h4 className="font-bold text-lg">Tasks:</h4>

                {project.tasks && project.tasks.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {project.tasks.map((task, idx) => (
                      <li
                        key={idx}
                        className="p-2 rounded-lg shadow-sm hover:shadow-md bg-blue-50 transition duration-200 ease-in-out"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-gray-800 transition duration-200 ease-in-out">
                            {task.name}
                          </div>
                          <span
                            className={`text-sm font-semibold py-1 px-2 rounded-lg ${
                              task.status === "completed"
                                ? "bg-green-400 text-white"
                                : task.status === "in-progress"
                                ? "bg-yellow-500 text-white"
                                : "bg-blue-400 text-white"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{task.description}</p>
                        <div className="mt-2">
                          <span className="font-semibold text-gray-600">
                            Score:{" "}
                          </span>
                          <span className="text-md font-bold text-blue-600">
                            {task.score}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No Tasks Added</p>
                )}
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => openModal(project._id)}
                className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2 px-6 rounded-lg"
              >
                Add Task
              </button>

              {/* Candidate Assignment Section */}
              {!project.assignedTo && (
                <div className="mt-6 space-y-4">
                  <select
                    value={candidateAssignment.candidateId}
                    onChange={(e) =>
                      setCandidateAssignment({
                        ...candidateAssignment,
                        candidateId: e.target.value,
                        projectId: project._id,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  >
                    <option value="">Assign Candidate</option>
                    {candidates.map((candidate) => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAssignCandidate}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-lg hover:bg-gradient-to-l hover:from-green-500 hover:to-blue-600 transition duration-300"
                  >
                    Assign Candidate
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-2xl font-semibold mb-4">Add Task to Project</h3>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                name="name"
                value={taskData.name}
                onChange={handleTaskChange}
                placeholder="Task Name"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4"
                required
              />
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleTaskChange}
                placeholder="Task Description"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4"
                required
              />
              <input
                type="number"
                name="score"
                value={taskData.score}
                onChange={handleTaskChange}
                placeholder="Task Score"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Add Task
              </button>
            </form>
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
