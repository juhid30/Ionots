import React from "react";

const TaskList = ({ tasks, projectId, handleTaskCompletion }) => (
  <>
    <h4 className="font-bold mb-2">Tasks:</h4>
    {tasks.length > 0 ? (
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{task.name}</td>
              <td className="px-4 py-2 max-h-16">
                <div
                  className="overflow-y-auto max-h-16"
                  style={{ whiteSpace: "normal" }}
                >
                  {task.description}
                </div>
              </td>
              <td className="px-4 py-2">
                {task.status === "completed" ? (
                  <span className="text-green-600 font-bold">Completed</span>
                ) : (
                  <span className="text-red-600 font-bold">Pending</span>
                )}
              </td>
              <td className="px-4 py-2">{task.score}</td>
              <td className="px-4 py-2">
                {task.status !== "completed" && (
                  <button
                    onClick={() => handleTaskCompletion(projectId, task._id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No tasks assigned yet.</p>
    )}
  </>
);

export default TaskList;
