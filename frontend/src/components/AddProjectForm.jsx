import { useState } from "react";

const AddProjectForm = ({ closeModal }) => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
  });

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    // Here, you would handle the project submission logic
    // After successful submission, close the modal
    console.log("Project Added:", newProject);
    closeModal();
  };

  return (
    <form onSubmit={handleAddProject} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Project</h2>

      <input
        type="text"
        name="title"
        value={newProject.title}
        onChange={handleProjectChange}
        placeholder="Project Title"
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        name="description"
        value={newProject.description}
        onChange={handleProjectChange}
        placeholder="Project Description"
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      ></textarea>
      <input
        type="date"
        name="deadline"
        value={newProject.deadline}
        onChange={handleProjectChange}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <select
        name="assignedTo"
        value={newProject.assignedTo}
        onChange={handleProjectChange}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Candidate (Optional)</option>
        {/* map candidates here */}
      </select>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Add Project
      </button>
    </form>
  );
};

export default AddProjectForm;
