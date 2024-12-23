import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "./TaskList";

const ProjectRow = ({
  project,
  isExpanded,
  toggleRow,
  handleAcceptProject,
  handleDeclineProject,
  handleTaskCompletion,
}) => (
  <>
    <tr
      className="border-b cursor-pointer hover:bg-gray-200 transition-all ease-in-out"
      onClick={() => toggleRow(project._id)}
    >
      <td className="px-6 py-4 text-lg font-semibold text-gray-700">
        {project.title}
      </td>
      <td className="px-6 py-4 text-md text-gray-600">{project.description}</td>
      <td className="px-6 py-4">
        <span
          className={`px-4 py-2 text-sm font-bold rounded-full ${
            project.status === "pending"
              ? " bg-[#f6f86bac] text-[#885624bd]"
              : project.status === "completed"
              ? "bg-[#8af191ac] text-[#136f19bd] "
              : "bg-[#8cc1e9ac] text-[#312488bd]"
          }`}
        >
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4 text-center space-x-3">
        {project.status === "pending" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcceptProject(project._id);
              }}
              className="bg-green-600 text-white py-[0.4rem] px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Accept
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeclineProject(project._id);
              }}
              className="bg-red-600 text-white py-[0.4rem] px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Decline
            </button>
          </>
        )}
      </td>
    </tr>
    <AnimatePresence>
      {isExpanded && (
        <motion.tr
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <td colSpan={4} className="bg-gray-50 px-6 py-4">
            <TaskList
              tasks={project.tasks}
              projectId={project._id}
              handleTaskCompletion={handleTaskCompletion}
            />
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  </>
);

export default ProjectRow;
