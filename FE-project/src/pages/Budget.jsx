import { useState, useEffect } from "react";
import { expenseAPI } from "../services/api";
import toast from "react-hot-toast";
import { TrendingUp, BarChart3, Trash2 } from "lucide-react";

const Budget = ({ projectId, totalBudget = 50000 }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Materials",
  });
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = ["Materials", "Labor", "Tools", "Permits", "Contractors", "Miscellaneous"];

  const formatINR = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const fetchExpenses = async () => {
    if (!projectId) return;
    try {
      const res = await expenseAPI.getAll(projectId);
      // Ensure we are accessing the data correctly based on Axios response structure
      const expList = (res.data?.expenses || res.expenses || []).map((e) => ({
        id: e._id || e.id,
        description: e.title || e.description,
        amount: e.amount,
        category: e.category,
      }));
      setExpenses(expList);
      setTotalSpent(expList.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0));
    } catch (error) {
      console.error("Load failed:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [projectId]);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!projectId) return toast.error("Please select a project first");

    setLoading(true);
    try {
      const payload = {
        title: newExpense.description, // Matching your backend 'title'
        amount: Number(newExpense.amount),
        category: newExpense.category,
        project_id: projectId,
      };

      const res = await expenseAPI.create(payload);
      
      // Refresh list from server to ensure data integrity
      await fetchExpenses(); 
      
      setNewExpense({ description: "", amount: "", category: "Materials" });
      toast.success("Expense added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await expenseAPI.delete(id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success("Deleted");
      fetchExpenses(); // Recalculate totals
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const budgetPercentage = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Budget</p>
          <p className="text-2xl font-bold text-emerald-600">{formatINR(totalBudget)}</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-2xl font-bold text-blue-600">{formatINR(totalSpent)}</p>
        </div>
        <div className={`p-6 border rounded-xl shadow-sm ${budgetPercentage > 90 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
          <p className="text-gray-500 text-sm">Remaining</p>
          <p className={`text-2xl font-bold ${budgetPercentage > 90 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatINR(totalBudget - totalSpent)}
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div 
              className={`h-2 rounded-full ${budgetPercentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateExpense} className="bg-white p-6 border rounded-xl shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
          <input 
            className="w-full border rounded-lg p-2 mt-1"
            value={newExpense.description}
            onChange={e => setNewExpense({...newExpense, description: e.target.value})}
            placeholder="e.g. Bathroom Tiles"
            required
          />
        </div>
        <div className="w-32">
          <label className="text-xs font-semibold text-gray-500 uppercase">Amount</label>
          <input 
            type="number"
            className="w-full border rounded-lg p-2 mt-1"
            value={newExpense.amount}
            onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
            placeholder="0.00"
            required
          />
        </div>
        <button 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {loading ? "Saving..." : "Add Expense"}
        </button>
      </form>

      {/* List */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b bg-gray-50 font-semibold">Expense History</div>
        <div className="divide-y">
          {expenses.length === 0 ? (
            <p className="p-8 text-center text-gray-400">No expenses recorded yet.</p>
          ) : (
            expenses.map(exp => (
              <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{exp.description}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{exp.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-gray-900">{formatINR(exp.amount)}</p>
                  <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;
