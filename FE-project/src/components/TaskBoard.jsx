import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function TaskBoard({ tasks, setTasks, projectId, userId, token }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");

  const columns = ["todo", "inprogress", "done"];

  // Add a new task
  const addTask = async () => {
    if (!newTaskTitle.trim()) return toast.error("Task title required");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/tasks",
        {
          project_id: projectId,
          title: newTaskTitle,
          status: selectedColumn,
          user_id: userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedTask = res.data.task;

      setTasks({
        ...tasks,
        [selectedColumn]: [addedTask, ...tasks[selectedColumn]],
      });

      setNewTaskTitle("");
      toast.success("Task added!");
    } catch (err) {
      console.error("Add task error:", err.response?.data || err.message);
      toast.error("Failed to add task");
    }
  };

  // Move task between columns
  const moveTask = async (taskIndex, from, to) => {
    const taskToMove = tasks[from][taskIndex];
    if (!taskToMove) return;

    try {
      await axios.patch(
        `http://localhost:8080/api/tasks/${taskToMove.id}`,
        { status: to },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks({
        ...tasks,
        [from]: tasks[from].filter((_, i) => i !== taskIndex),
        [to]: [...tasks[to], { ...taskToMove, status: to }],
      });

      toast.success(`Task moved to ${to}`);
    } catch (err) {
      console.error("Move task error:", err.response?.data || err.message);
      toast.error("Failed to move task");
    }
  };

  return (
    <div>
      {/* Add Task */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="border rounded-xl p-2 flex-1"
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="border rounded-xl p-2"
        >
          {columns.map((col) => (
            <option key={col} value={col}>
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Task Columns */}
      <div className="grid md:grid-cols-3 gap-6">
        {columns.map((status) => (
          <div key={status} className="bg-white rounded-3xl shadow p-6">
            <div className="flex gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                  status === "todo"
                    ? "bg-blue-100 text-blue-700"
                    : status === "inprogress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="space-y-3">
              {tasks[status].length === 0 && (
                <div className="text-gray-400 italic">No tasks</div>
              )}

              {tasks[status].map((task, i) => (
                <div
                  key={task.id}
                  className="bg-gray-100 rounded-xl p-3 hover:shadow-md transition"
                >
                  <div className="font-semibold">{task.title}</div>

                  {/* Move buttons */}
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {columns
                      .filter((col) => col !== status)
                      .map((col) => (
                        <button
                          key={col}
                          onClick={() => moveTask(i, status, col)}
                          className={`text-sm ${
                            col === "todo"
                              ? "text-blue-500"
                              : col === "inprogress"
                              ? "text-yellow-500"
                              : "text-green-500"
                          } hover:underline`}
                        >
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}