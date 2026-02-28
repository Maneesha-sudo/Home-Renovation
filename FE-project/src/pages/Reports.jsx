import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

export default function Reports() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const downloadPDF = (project) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(project.title, 10, 20);
    doc.setFontSize(12);
    doc.text(`Budget: ₹${project.budget}`, 10, 30);
    doc.text(`Status: ${project.status}`, 10, 40);
    doc.save(`${project.title}-report.pdf`);
  };

  if (!user) return <div>Please log in to view reports.</div>;
  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Project Reports</h2>

      {projects.length === 0 ? (
        <div>No projects yet.</div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-gray-500">Budget: ₹{p.budget}</p>
                <p className="text-gray-500">Status: {p.status}</p>
              </div>
              <button
                onClick={() => downloadPDF(p)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}