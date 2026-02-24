import React from "react";

export default function ExpenseCard({ expense }) {
  return (
    <div className="bg-white shadow rounded p-3 mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{expense.name}</h3>
        <p className="text-sm text-gray-500">Amount: ${expense.amount}</p>
        <p className="text-sm text-gray-500">Category: {expense.category}</p>
      </div>
      <span className="text-gray-700">{new Date(expense.date).toLocaleDateString()}</span>
    </div>
  );
}