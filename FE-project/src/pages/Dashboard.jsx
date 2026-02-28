import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, DollarSign, CheckCircle, Users, Plus } from 'lucide-react';
import api, { expenseAPI } from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalExpenses: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        const projectsData = res.data.projects || [];
        setProjects(projectsData);

        const totalProjects = projectsData.length;
        let totalExpenses = 0;
        let totalTasks = 0;
        let completedTasks = 0;

        projectsData.forEach(project => {
          if (project.expenses) {
            totalExpenses += project.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
          }
          if (project.tasks) {
            totalTasks += project.tasks.length;
            completedTasks += project.tasks.filter(t => t.completed).length;
          }
        });

        setStats({ totalProjects, totalExpenses, totalTasks, completedTasks });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* HERO */}
      <div className="text-center py-12 lg:py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent mb-4 lg:mb-6">
          Welcome back!
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto px-4">
Turn your renovation dreams into reality.        </p>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { icon: BarChart3, value: stats.totalProjects, label: 'Active Projects', color: 'from-blue-500 to-blue-600' },
            { icon: DollarSign, value: `₹${stats.totalExpenses.toLocaleString()}`, label: 'Total Spent', color: 'from-emerald-500 to-emerald-600' },
            { icon: CheckCircle, value: stats.completedTasks, label: 'Completed Tasks', color: 'from-purple-500 to-purple-600' },
            { icon: Users, value: stats.totalTasks, label: 'Total Tasks', color: 'from-indigo-500 to-indigo-600' }
          ].map((card, i) => (
            <div key={i} className="group bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all h-full">
              <div className="flex items-center justify-between">
                <div className={`p-3 lg:p-4 bg-gradient-to-r ${card.color} rounded-xl group-hover:scale-105`}>
                  <card.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl lg:text-4xl font-black text-gray-900">{card.value}</p>
                  <p className="text-xs lg:text-sm text-gray-500 font-medium mt-1">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-10 -mt-6 lg:-mt-8 relative z-10">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {[
              { path: '/dashboard/projects', icon: Plus, color: 'blue', title: 'New Project', desc: 'Start tracking your next home improvement' },
              { path: '/dashboard/budget', icon: DollarSign, color: 'emerald', title: 'Add Expense', desc: 'Track every rupee you spend' },
              { path: '/dashboard/tasks', icon: CheckCircle, color: 'purple', title: 'New Task', desc: 'Create tasks for your projects' }
            ].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className={`group p-6 lg:p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all hover:shadow-lg hover:-translate-y-1 h-full flex flex-col items-center justify-center text-center`}
              >
                <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-${action.color}-100 group-hover:bg-${action.color}-200 p-4 lg:p-5 rounded-2xl mb-4 group-hover:scale-110 transition-all`}>
                  <action.icon className={`h-6 w-6 lg:h-8 lg:w-8 text-${action.color}-600 mx-auto group-hover:rotate-12`} />
                </div>
                <h4 className={`font-bold text-lg lg:text-xl text-gray-900 mb-2 group-hover:text-${action.color}-700`}>{action.title}</h4>
                <p className="text-sm text-gray-600">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
