import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        if(err.response?.status === 401) navigate("/login");
      }
    };
    fetchProjects();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? <p>No projects found</p> :
          projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  );
}