import { PieChart, Pie } from "recharts";

export default function BudgetChart() {
  const data = [
    { name: "Spent", value: 180000 },
    { name: "Remaining", value: 120000 },
  ];

  return (
    <PieChart width={400} height={300}>
      <Pie data={data} dataKey="value" outerRadius={100} fill="#22c55e" />
    </PieChart>
  );
}