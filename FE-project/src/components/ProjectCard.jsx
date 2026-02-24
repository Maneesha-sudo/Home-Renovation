import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-xl transition"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <h2 className="font-bold text-lg">{project.name}</h2>
      <p className="text-sm text-gray-500">
        Deadline: {new Date(project.deadline).toLocaleDateString()}
      </p>
      <p className="text-sm">
        Status: <span className="font-medium">{project.status}</span>
      </p>
    </div>
  );
}