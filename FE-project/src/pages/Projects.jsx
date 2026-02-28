import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Projects() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", budget: 0, status: "planning" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  useEffect(() => {
    if (!user) return setLoading(false);
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projectsWithId = (res.data.projects || []).map((p, idx) => ({
          _id: p._id || p.id || `temp-${idx}-${Date.now()}`,
          ...p,
        }));
        setProjects(projectsWithId);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const handleAddProject = async () => {
    if (!newProject.title.trim()) return;
    try {
      setError("");
      const res = await axios.post(
        "http://localhost:8080/api/projects",
        { name: newProject.title, budget: newProject.budget, status: newProject.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdProj = res.data.project;
      setProjects([{ _id: createdProj._id || createdProj.id || `temp-${Date.now()}`, ...createdProj }, ...projects]);
      setNewProject({ title: "", budget: 0, status: "planning" });
    } catch (err) {
      console.error(err);
      setError("Failed to create project.");
    }
  };

  const handleDeleteProject = async (_id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/projects/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p._id !== _id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete project.");
    }
  };

  if (authLoading || loading) return <div>Loading projects...</div>;
  if (!user) return <div>Please log in to view your projects.</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Your Projects</h2>

      {/* Add Project */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          placeholder="Project title..."
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          className="border rounded-xl p-2 flex-1"
        />
        <div className="border rounded-xl p-2 w-32 flex items-center">
          <span className="mr-1 text-gray-600">₹</span>
          <input
            type="number"
            placeholder="Budget"
            value={newProject.budget}
            onChange={(e) => setNewProject({ ...newProject, budget: parseFloat(e.target.value) || 0 })}
            className="flex-1 outline-none"
          />
        </div>
        <select
          value={newProject.status}
          onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
          className="border rounded-xl p-2 w-36"
        >
          <option value="planning">Planning</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handleAddProject} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          Add Project
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Project List */}
      {projects.length === 0 ? (
        <div>No projects yet. Add one above!</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p._id} className="relative bg-white shadow rounded-2xl p-4 hover:shadow-lg transition group">
              <button
                onClick={() => handleDeleteProject(p._id)}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition"
              >
                Delete
              </button>
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-gray-500">Budget: {formatINR(p.budget)}</p>
              <p className="text-gray-400">Status: {p.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}