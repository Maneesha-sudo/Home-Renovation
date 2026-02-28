import { useState, useEffect } from "react";
import ContractorCard from "../components/ContractorCard";
import toast from "react-hot-toast";
import { contractorAPI } from "../services/api";

export default function Contractors() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContractor, setNewContractor] = useState({
    name: "",
    speciality: "",
    phone: "",
    email: "",
    past_projects: ""
  });

  // Fetch contractors on mount
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const data = await contractorAPI.getAll();
        setContractors(data.contractors || []);
      } catch (err) {
        toast.error("Failed to load contractors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContractors();
  }, []);

  // Add contractor
  const handleAddContractor = async () => {
    const { name, speciality, phone, email } = newContractor;
    if (!name || !speciality || !phone || !email)
      return toast.error("All fields are required");

    try {
      const data = await contractorAPI.create(newContractor);
      setContractors([data.contractor, ...contractors]);
      setNewContractor({
        name: "",
        speciality: "",
        phone: "",
        email: "",
        past_projects: ""
      });
      toast.success("Contractor added!");
    } catch (err) {
      toast.error("Failed to add contractor");
      console.error(err);
    }
  };

  // Update contractor in state
  const handleUpdate = (updated) => {
    setContractors(
      contractors.map(c =>
        c.id === updated.id || c._id === updated._id ? updated : c
      )
    );
  };

  // Delete contractor from state
  const handleDelete = (id) => {
    setContractors(contractors.filter(c => c.id !== id && c._id !== id));
  };

  if (loading) return <div>Loading contractors...</div>;

  return (
    <div className="p-8 space-y-6">
      {/* Add Contractor Form */}
      <div className="grid md:grid-cols-5 gap-2">
        <input
          type="text"
          placeholder="Name"
          value={newContractor.name}
          onChange={(e) => setNewContractor({ ...newContractor, name: e.target.value })}
          className="border rounded-xl p-2"
        />
        <input
          type="text"
          placeholder="Speciality"
          value={newContractor.speciality}
          onChange={(e) => setNewContractor({ ...newContractor, speciality: e.target.value })}
          className="border rounded-xl p-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={newContractor.phone}
          onChange={(e) => setNewContractor({ ...newContractor, phone: e.target.value })}
          className="border rounded-xl p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newContractor.email}
          onChange={(e) => setNewContractor({ ...newContractor, email: e.target.value })}
          className="border rounded-xl p-2"
        />
        <button
          type="button"
          onClick={handleAddContractor}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Add Contractor
        </button>
      </div>

      {/* Contractor List */}
      <div className="grid md:grid-cols-3 gap-6">
        {contractors.map((c) => (
          <ContractorCard
            key={c.id || c._id}
            contractor={c}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}