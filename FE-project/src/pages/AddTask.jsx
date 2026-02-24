import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axiosConfig";

export default function AddTask() {
  const { projectId } = useParams();
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${projectId}/tasks`, { name, deadline, assignedTo, status });
      navigate(`/project/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Task creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-6">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Task Name" value={name} 
                 onChange={(e)=>setName(e.target.value)}
                 className="w-full p-2 border mb-4 rounded"/>
          <input type="date" value={deadline} 
                 onChange={(e)=>setDeadline(e.target.value)}
                 className="w-full p-2 border mb-4 rounded"/>
          <input type="text" placeholder="Assigned To (Email)" value={assignedTo} 
                 onChange={(e)=>setAssignedTo(e.target.value)}
                 className="w-full p-2 border mb-4 rounded"/>
          <select value={status} onChange={(e)=>setStatus(e.target.value)}
                  className="w-full p-2 border mb-4 rounded">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}