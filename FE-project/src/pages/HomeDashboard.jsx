import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart3, DollarSign, CheckCircle, Users, Plus } from "lucide-react";
import API from "../api/axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalExpenses: 0,
    totalTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/api/projects");
        const projectsData = res.data.projects || [];
        setProjects(projectsData);

        let totalExpenses = 0;
        let totalTasks = 0;
        let completedTasks = 0;

        projectsData.forEach((project) => {
          if (project.expenses) totalExpenses += project.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
          if (project.tasks) {
            totalTasks += project.tasks.length;
            completedTasks += project.tasks.filter((t) => t.completed).length;
          }
        });

        setStats({
          totalProjects: projectsData.length,
          totalExpenses,
          totalTasks,
          completedTasks
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-8">
      {/* Home Hero */}
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-700">
          Transform Your Home with Confidence
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Plan, track, and manage renovations beautifully.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: BarChart3, value: stats.totalProjects, label: "Projects", color: "from-blue-500 to-blue-600" },
          { icon: DollarSign, value: `₹${stats.totalExpenses.toLocaleString()}`, label: "Total Spent", color: "from-emerald-500 to-emerald-600" },
          { icon: CheckCircle, value: stats.completedTasks, label: "Completed Tasks", color: "from-purple-500 to-purple-600" },
          { icon: Users, value: stats.totalTasks, label: "Total Tasks", color: "from-indigo-500 to-indigo-600" }
        ].map((card, i) => (
          <div key={i} className={`group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border hover:shadow-xl transition-all`}>
            <div className="flex items-center justify-between">
              <div className={`p-3 bg-gradient-to-r ${card.color} rounded-xl`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { path: "/dashboard/projects", icon: Plus, title: "New Project", color: "blue", desc: "Start tracking your next home improvement" },
            { path: "/dashboard/budget", icon: DollarSign, title: "Add Expense", color: "emerald", desc: "Track every dollar you spend" },
            { path: "/dashboard/tasks", icon: CheckCircle, title: "New Task", color: "purple", desc: "Create tasks for your projects" }
          ].map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className={`flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all`}
            >
              <div className={`w-16 h-16 bg-${action.color}-100 p-4 rounded-xl mb-3`}>
                <action.icon className={`h-6 w-6 text-${action.color}-600`} />
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-1">{action.title}</h4>
              <p className="text-sm text-gray-600 text-center">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}