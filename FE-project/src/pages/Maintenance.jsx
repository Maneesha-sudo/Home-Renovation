// src/pages/Maintenance.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Maintenance() {
  const { user } = useAuth();
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ title: "", frequency: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) return;

    const fetchMaintenance = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/maintenance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaintenanceItems(res.data.maintenance || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load maintenance items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, [user]);

  const handleAdd = async () => {
    if (!newItem.title || !newItem.frequency) return toast.error("All fields required");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/maintenance",
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaintenanceItems([res.data.item, ...maintenanceItems]);
      setNewItem({ title: "", frequency: "" });
      toast.success("Maintenance item added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this maintenance item?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/maintenance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaintenanceItems(maintenanceItems.filter((i) => i.id !== id));
      toast.success("Deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    }
  };

  if (!user) return <div>Please log in to view maintenance items.</div>;
  if (loading) return <div>Loading maintenance items...</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Home Maintenance</h2>

      {/* Add new item */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Task (e.g., HVAC check)"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="border rounded-xl p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Frequency (e.g., monthly)"
          value={newItem.frequency}
          onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value })}
          className="border rounded-xl p-2 w-48"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Maintenance list */}
      {maintenanceItems.length === 0 ? (
        <div>No maintenance tasks added yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {maintenanceItems.map((item) => (
            <div
              key={item.id || item._id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500">{item.frequency}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id || item._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}