import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import ExpenseCard from "../components/ExpenseCard";
import PhotoCard from "../components/PhotoCard";
import API from "../api/axiosConfig";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/api/projects/${id}`);
        setProject(res.data.project);
        setTasks(res.data.tasks || []);
        setExpenses(res.data.expenses || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load project data.");
      }
    };
    fetchProject();
  }, [id]);

  if (!project) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Project Info */}
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600 mb-2">{project.description}</p>
        <p className="mb-4">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>

        {/* Tasks */}
        <h2 className="text-2xl font-semibold mb-2">Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}

        {/* Expenses */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          expenses.map((exp) => <ExpenseCard key={exp.id} expense={exp} />)
        )}

        {/* Progress Photos */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Progress Photos</h2>
        {(!project.photos || project.photos.length === 0) ? (
          <p>No photos yet</p>
        ) : (
          <div className="flex flex-wrap">
            {project.photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}