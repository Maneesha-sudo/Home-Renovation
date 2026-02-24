import React from "react";

export default function TaskCard({ task }) {
  return (
    <div className="bg-gray-50 shadow rounded p-3 mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-500">
          Deadline: {new Date(task.deadline).toLocaleDateString()}
        </p>
        <p className="text-sm">Assigned to: {task.assignedTo || "N/A"}</p>
      </div>
      <span
        className={`px-2 py-1 rounded text-white text-xs ${
          task.status === "completed" ? "bg-green-500" : "bg-yellow-500"
        }`}
      >
        {task.status}
      </span>
    </div>
  );
}