import { useState } from "react";
// For the axios instance and all APIs
import api, { authAPI, projectAPI, expenseAPI, taskAPI, contractorAPI } from '../services/api';import toast from "react-hot-toast";

export default function ContractorCard({ contractor, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(contractor.name || "");
  const [speciality, setSpeciality] = useState(contractor.speciality || "");
  const [phone, setPhone] = useState(contractor.phone || "");
  const [email, setEmail] = useState(contractor.email || "");
  const [pastProjects, setPastProjects] = useState(contractor.pastProjects || "");

  const handleSave = async () => {
    try {
      const updated = await contractorAPI.update(contractor.id || contractor._id, {
        name,
        speciality,
        phone,
        email,
        pastProjects,
      });
      onUpdate(updated.contractor);
      setEditing(false);
      toast.success("Contractor updated!");
    } catch {
      toast.error("Failed to update contractor");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this contractor?")) return;
    try {
      await contractorAPI.delete(contractor.id || contractor._id);
      onDelete(contractor.id || contractor._id);
      toast.success("Contractor deleted!");
    } catch {
      toast.error("Failed to delete contractor");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition">
      {/* Avatar / Initials */}
      <div className="h-32 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center text-gray-400 text-xl">
        {contractor.name ? contractor.name.charAt(0) : "U"}
      </div>

      {editing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-1 mb-2 w-full"
            placeholder="Name"
          />
          <input
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            className="border rounded p-1 mb-2 w-full"
            placeholder="Speciality"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded p-1 mb-2 w-full"
            placeholder="Phone"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-1 mb-2 w-full"
            placeholder="Email"
          />
          <input
            value={pastProjects}
            onChange={(e) => setPastProjects(e.target.value)}
            className="border rounded p-1 mb-2 w-full"
            placeholder="Past Projects"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="bg-gray-300 px-3 py-1 rounded">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">{contractor.name}</h3>
          <p className="text-gray-500">{speciality}</p>
          {phone && (
            <p className="text-gray-500">
              Phone: <a href={`tel:${phone}`} className="text-blue-500 hover:underline">{phone}</a>
            </p>
          )}
          {email && (
            <p className="text-gray-500">
              Email: <a href={`mailto:${email}`} className="text-blue-500 hover:underline">{email}</a>
            </p>
          )}
          {pastProjects && <p className="text-gray-500">Past Projects: {pastProjects}</p>}
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(true)} className="text-blue-500 hover:underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}