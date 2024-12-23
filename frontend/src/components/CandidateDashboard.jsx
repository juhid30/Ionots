import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "./DashboardHeader";
import ProjectTable from "./ProjectTable";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CandidateDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showStatistics, setShowStatistics] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/projects/assigned`, {
        withCredentials: true,
      })
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
  }, []);

  const toggleRow = (projectId) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(projectId)
        ? prevExpandedRows.filter((id) => id !== projectId)
        : [...prevExpandedRows, projectId]
    );
  };

  const handleAcceptProject = async (projectId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/projects/accept-reject`,
        { projectId, decision: "accept" },
        { withCredentials: true }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, status: "in-progress" }
            : project
        )
      );
    } catch (error) {
      console.error("Error accepting project:", error);
    }
  };

  const handleDeclineProject = async (projectId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/projects/decline/${projectId}`
      );
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
    } catch (error) {
      console.error("Error declining project:", error);
    }
  };

  const handleTaskCompletion = async (projectId, taskId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/task/${taskId}/complete`,
        {},
        { withCredentials: true }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task._id === taskId ? { ...task, status: "completed" } : task
                ),
              }
            : project
        )
      );
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  // Calculate statistics
  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === "in-progress"
  ).length;
  const pendingProjects = projects.filter(
    (project) => project.status === "pending"
  ).length;

  const totalTasks = projects.reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );
  const completedTasks = projects.reduce(
    (acc, project) =>
      acc + project.tasks.filter((task) => task.status === "completed").length,
    0
  );
  const taskCompletionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <DashboardHeader title="Welcome to Your Dashboard!" />
      <div className="flex flex-col items-center justify-start p-6">
        {loading ? (
          <p>Loading...</p>
        ) : showStatistics ? (
          <div className="w-full max-w-5xl border shadow-lg shadow-gray-600 rounded-lg p-8 flex ">
            {/* Left Section: Statistics */}
            <div className="flex-1 pr-6">
              <h2 className="text-3xl font-extrabold mb-8 tracking-wide">
                Project Statistics 📊
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center space-x-4 bg-opacity-30 bg-green-700 rounded-lg p-4 shadow-lg">
                  <div className="h-12 w-12 bg-green-600 flex items-center justify-center rounded-full text-2xl font-bold">
                    ✔️
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Completed Projects
                    </h3>
                    <p className="text-2xl text-green-700 font-bold">
                      {completedProjects}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-opacity-30 bg-blue-700 rounded-lg p-4 shadow-lg">
                  <div className="h-12 w-12 bg-blue-600 flex items-center justify-center rounded-full text-2xl font-bold">
                    🔄
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      In-Progress Projects
                    </h3>
                    <p className="text-2xl text-blue-600 font-bold">
                      {inProgressProjects}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-opacity-30 bg-yellow-700 rounded-lg p-4 shadow-lg">
                  <div className="h-12 w-12 bg-yellow-600 flex items-center justify-center rounded-full text-2xl font-bold">
                    ⏳
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Pending Projects</h3>
                    <p className="text-2xl text-yellow-600 font-bold">
                      {pendingProjects}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Progress Bar */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <h2 className="text-2xl font-bold tracking-wide">
                Tasks Completed ✅
              </h2>
              <div className="w-48 h-48">
                <CircularProgressbar
                  value={taskCompletionPercentage}
                  text={`${taskCompletionPercentage}%`}
                  styles={buildStyles({
                    textColor: "#000",
                    pathColor: "#75d7a499",
                    trailColor: "#9675d799",
                  })}
                />
              </div>
              <button
                onClick={() => setShowStatistics(false)}
                className="bg-[#ac72e6c3] hover:bg-[#9a55dee9] px-6 py-3 rounded-lg font-bold shadow-md transition-transform transform hover:scale-105"
              >
                View Assigned Projects
              </button>
            </div>
          </div>
        ) : (
          <>
            <ProjectTable
              projects={projects}
              expandedRows={expandedRows}
              toggleRow={toggleRow}
              handleAcceptProject={handleAcceptProject}
              handleDeclineProject={handleDeclineProject}
              handleTaskCompletion={handleTaskCompletion}
            />

            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              View Statistics
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
