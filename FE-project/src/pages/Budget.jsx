import { useState, useEffect } from "react";
import { expenseAPI } from "../services/api";
import toast from "react-hot-toast";
import { Plus, TrendingUp, BarChart3 } from "lucide-react";

const Budget = ({ projectId, totalBudget = 50000 }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Materials",
    date: new Date().toISOString().split("T")[0],
  });
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const categories = [
    "Materials",
    "Labor",
    "Tools",
    "Permits",
    "Contractors",
    "Miscellaneous",
  ];

  // Format numbers in Indian style with ₹
  const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  // Fetch expenses when project changes
  useEffect(() => {
    if (projectId) fetchExpenses();
  }, [projectId]);

  const fetchExpenses = async () => {
    if (!projectId) return;
    try {
      const data = await expenseAPI.getAll(projectId);
      const expList = (data.expenses || []).map((e, idx) => ({
        id: e.id || e._id || `temp-${idx}-${Date.now()}`,
        ...e,
      }));
      setExpenses(expList);
      const total = expList.reduce(
        (sum, exp) => sum + parseFloat(exp.amount || 0),
        0
      );
      setTotalSpent(total);
    } catch (error) {
      console.error("Failed to load expenses", error);
      toast.error("Failed to load expenses");
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!projectId) return toast.error("Project not selected");
    if (!newExpense.description || !newExpense.amount)
      return toast.error("Description and Amount are required");

    setLoading(true);
    try {
      const payload = {
        title: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        expense_date: newExpense.date,
        project_id: projectId,
      };

      const data = await expenseAPI.create(payload);

      // Add new expense immediately to the list
      const addedExpense = {
        id: data.expense?.id || data.expense?._id || `temp-${Date.now()}`,
        ...data.expense,
      };
      setExpenses([addedExpense, ...expenses]);

      // Reset form
      setNewExpense({
        description: "",
        amount: "",
        category: "Materials",
        date: new Date().toISOString().split("T")[0],
      });

      // Update total spent
      setTotalSpent((prev) => prev + parseFloat(addedExpense.amount || 0));

      toast.success("Expense added successfully!");
    } catch (error) {
      console.error("Add expense failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeletingId(id);
    try {
      await expenseAPI.delete(id);
      const deletedExpense = expenses.find((e) => e.id === id);
      setExpenses(expenses.filter((e) => e.id !== id));
      setTotalSpent((prev) => prev - parseFloat(deletedExpense?.amount || 0));
      toast.success("Expense deleted!");
    } catch (error) {
      console.error("Delete expense failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  };

  const budgetPercentage =
    totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 p-4">
      {/* Budget Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Budget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-white">
              ₹
            </div>
            <div>
              <p className="text-3xl font-bold">{formatINR(totalBudget)}</p>
              <p className="text-sm text-gray-500">Total Budget</p>
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 rounded-xl ${
                budgetPercentage > 80
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
            >
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{formatINR(totalSpent)}</p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div
          className={`bg-white rounded-2xl p-6 shadow-sm border ${
            budgetPercentage > 80 ? "border-red-200" : "border-green-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 rounded-xl ${
                budgetPercentage > 80
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}
            >
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p
                className={`text-3xl font-bold ${
                  budgetPercentage > 80 ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatINR(totalBudget - totalSpent)}
              </p>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-2xl font-bold mt-1">{budgetPercentage}% Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <form
        className="bg-white rounded-xl p-6 shadow border space-y-4"
        onSubmit={handleCreateExpense}
      >
        <h3 className="text-xl font-semibold">Add New Expense</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            required
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            className="border rounded p-2 col-span-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            required
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            className="border rounded p-2"
          />
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="border rounded p-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      {/* Expense List */}
      <div className="bg-white rounded-xl p-6 shadow border space-y-2">
        <h3 className="text-xl font-semibold mb-4">Expenses</h3>
        {expenses.length === 0 && <p className="text-gray-500">No expenses yet</p>}
        <ul className="space-y-2">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="flex justify-between items-center border p-2 rounded hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium">{exp.description}</p>
                <p className="text-sm text-gray-500">
                  {formatINR(exp.amount)} | {exp.category}
                </p>
              </div>
              <button
                onClick={() => handleDeleteExpense(exp.id)}
                disabled={deletingId === exp.id}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Budget;