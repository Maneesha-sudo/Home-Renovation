export const templates = [
  {
    name: "Bathroom Remodel",
    tasks: ["Demolition", "Plumbing", "Tiling", "Painting"],
    budget: 50000,
  },
  {
    name: "Kitchen Upgrade",
    tasks: ["Cabinets", "Countertop", "Appliances"],
    budget: 100000,
  },
];

// Use in Projects.jsx
<select
  onChange={(e) => {
    const template = templates.find(t => t.name === e.target.value);
    if (template) {
      setNewProject({
        title: template.name,
        budget: template.budget,
        status: "planning",
      });
    }
  }}
>
  <option value="">Select Template</option>
  {templates.map((t) => (
    <option key={t.name} value={t.name}>
      {t.name}
    </option>
  ))}
</select>