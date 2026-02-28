import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 p-6">
        <div className="h-48 bg-gray-200 rounded-2xl mb-4" />
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-gray-500">Budget: ₹{project.budget}</p>

        <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}