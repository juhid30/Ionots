import ProjectCard from "./ProjectCard";

const ProjectOverview = ({ projects, candidates }) => {
  return (
    <div className="w-full max-w-3xl mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Projects Overview
      </h2>
      <ul className="space-y-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            candidates={candidates}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProjectOverview;
