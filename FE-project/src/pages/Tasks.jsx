import { useState, useEffect } from "react";
import TaskBoard from "../components/TaskBoard";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Tasks({ projectId }) {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !projectId) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/api/tasks?project_id=${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.tasks || [];
        const grouped = { todo: [], inprogress: [], done: [] };
        data.forEach((t) => {
          if (t.status === "inprogress") grouped.inprogress.push(t);
          else if (t.status === "done") grouped.done.push(t);
          else grouped.todo.push(t);
        });
        setTasks(grouped);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, projectId]);

  if (authLoading) return <div>Checking authentication...</div>;
  if (!user) return <div>Please log in to view tasks.</div>;
  if (!projectId) return <div>Please select a project.</div>;
  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Project Tasks</h2>
      <TaskBoard
        tasks={tasks}
        setTasks={setTasks}
        projectId={projectId}
        userId={user.id}
        token={localStorage.getItem("token")}
      />
    </div>
  );
}