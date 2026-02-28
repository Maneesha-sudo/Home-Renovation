import { useState } from "react";

export default function MaterialList({ projectId }) {
  const [materials, setMaterials] = useState([
    // Example initial state
    { name: "Paint", quantity: 5, cost: 500 },
    { name: "Cement", quantity: 10, cost: 300 },
  ]);

  const totalCost = materials.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-2">
      <h3 className="font-semibold text-lg">Material Shopping List</h3>
      <ul>
        {materials.map((m, i) => (
          <li key={i} className="flex justify-between">
            <span>{m.name} x{m.quantity}</span>
            <span>₹{m.cost}</span>
          </li>
        ))}
      </ul>
      <p className="font-bold text-right">Total: ₹{totalCost}</p>
    </div>
  );
}