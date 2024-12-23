import React from "react";
import ProjectRow from "./ProjectRow";

const ProjectTable = ({
  projects,
  expandedRows,
  toggleRow,
  handleAcceptProject,
  handleDeclineProject,
  handleTaskCompletion,
}) => (
  <div className="w-full max-w-6xl shadow-gray-400 shadow-lg rounded-lg p-6">
    <h2 className="text-3xl font-extrabold mb-6 tracking-wide">
      Assigned Projects 🚀
    </h2>
    <table className="table-auto w-full bg-white rounded-lg shadow-md border-separate border-spacing-0">
      <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <tr>
          <th className="px-6 py-3 text-left">Project Title</th>
          <th className="px-6 py-3 text-left">Description</th>
          <th className="px-6 py-3 text-left">Status</th>
          <th className="px-6 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <ProjectRow
            key={project._id}
            project={project}
            isExpanded={expandedRows.includes(project._id)}
            toggleRow={toggleRow}
            handleAcceptProject={handleAcceptProject}
            handleDeclineProject={handleDeclineProject}
            handleTaskCompletion={handleTaskCompletion}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProjectTable;
