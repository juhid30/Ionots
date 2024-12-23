import { useState } from "react";
import axios from "axios";

const ProjectCard = ({ project, candidates, refreshProjects }) => {
  const [candidateAssignment, setCandidateAssignment] = useState({
    candidateId: "",
    projectId: project._id,
  });
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
  });

  const handleAssignCandidate = () => {
    // Add logic to assign candidate to project
    console.log("Assigned Candidate:", candidateAssignment);
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async () => {
    const { name, description } = taskData;

    if (name && description) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/projects/add-task`,
          {
            projectId: project._id,
            task: {
              name,
              description,
            },
          }
        );
        // Refresh projects to reflect the new task
        refreshProjects();
        setTaskData({ name: "", description: "" }); // Clear task input
      } catch (error) {
        console.error("Error adding task:", error);
      }
    } else {
      alert("Task name and description are required");
    }
  };

  return (
    <li className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
      <p className="text-gray-600">
        Assigned To:{" "}
        {project.assignedTo ? project.assignedTo.name : "Not Assigned"}
      </p>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700">Tasks:</h4>
        {project.tasks && project.tasks.length > 0 ? (
          <ul className="list-disc pl-5">
            {project.tasks.map((task, idx) => (
              <li key={idx} className="text-gray-600">
                <strong>{task.name}</strong>: {task.description} ({task.status})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No Tasks Added</p>
        )}
      </div>

      {/* Add Task Form */}
      <div className="mt-4">
        <input
          type="text"
          name="name"
          value={taskData.name}
          onChange={handleTaskChange}
          placeholder="Task Name"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleTaskChange}
          placeholder="Task Description"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        ></textarea>
        <button
          onClick={handleAddTask}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Task
        </button>
      </div>

      {/* Candidate Assignment */}
      {!project.assignedTo && (
        <div className="mt-6 space-y-4">
          <select
            value={candidateAssignment.candidateId}
            onChange={(e) =>
              setCandidateAssignment({
                ...candidateAssignment,
                candidateId: e.target.value,
              })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate._id} value={candidate._id}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignCandidate}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Assign Candidate
          </button>
        </div>
      )}
    </li>
  );
};

export default ProjectCard;
