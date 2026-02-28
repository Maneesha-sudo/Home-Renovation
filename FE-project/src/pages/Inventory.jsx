import { useState } from "react";

export default function Inventory() {
  const [items, setItems] = useState([
    { name: "Hammer", quantity: 1 },
    { name: "Paint Brush", quantity: 3 },
  ]);

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-2">
      <h3 className="font-semibold text-lg">Inventory</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="flex justify-between">
            <span>{item.name}</span>
            <span>Qty: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}