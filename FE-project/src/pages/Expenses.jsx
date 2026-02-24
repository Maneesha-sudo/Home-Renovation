import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import API from "../api/axiosConfig";

export default function Expenses() {
  const { projectId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get(`/projects/${projectId}/expenses`);
        setExpenses(res.data.expenses || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExpenses();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/projects/${projectId}/expenses`, { name, amount, category });
      setExpenses(prev => [...prev, res.data.expense]);
      setName(""); setAmount(""); setCategory(""); setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Expense creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-6">
        <h2 className="text-2xl font-bold mb-4">Expenses</h2>
        {expenses.map(exp => <ExpenseCard key={exp.id} expense={exp} />)}

        <h3 className="text-xl font-semibold mt-6 mb-2">Add Expense</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Expense Name" value={name} 
                 onChange={(e)=>setName(e.target.value)}
                 className="w-full p-2 border mb-2 rounded"/>
          <input type="number" placeholder="Amount" value={amount} 
                 onChange={(e)=>setAmount(e.target.value)}
                 className="w-full p-2 border mb-2 rounded"/>
          <input type="text" placeholder="Category" value={category} 
                 onChange={(e)=>setCategory(e.target.value)}
                 className="w-full p-2 border mb-4 rounded"/>
          <button className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}