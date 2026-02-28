// src/pages/Templates.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Templates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/templates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if res.data.templates exists, fallback to empty array
        const fetchedTemplates = res.data.templates || res.data || [];
        setTemplates(fetchedTemplates);
      } catch (err) {
        console.error("Error fetching templates:", err);
        toast.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTemplates();
  }, [user, token]);

  const handleUseTemplate = async (template) => {
    toast.success(`Project created using "${template.name}" template!`);
    // Optionally: POST to /api/projects to create new project from template
  };

  if (!user) return <div>Please log in to view templates.</div>;
  if (loading) return <div>Loading templates...</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Project Templates</h2>

      {templates.length === 0 ? (
        <div className="text-gray-500">
          No templates available. You can create new templates from your projects.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, idx) => (
            <div key={t._id || idx} className="bg-white shadow rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-2">{t.name || "Unnamed Template"}</h3>
              <p className="text-gray-500 mb-1">
                Budget: ₹{t.budget?.toLocaleString("en-IN") || 0}
              </p>
              <p className="text-gray-500 mb-2">
                Tasks: {t.tasks?.length ? t.tasks.join(", ") : "No tasks defined"}
              </p>
              <button
                onClick={() => handleUseTemplate(t)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}