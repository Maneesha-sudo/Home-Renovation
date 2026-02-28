import { useState } from "react";
export default function ProjectDetails() {
  const [tab, setTab] = useState("overview");

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Kitchen Remodel</h2>

      <div className="flex space-x-8 border-b mb-6">
        {["overview", "photos", "budget"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 capitalize ${
              tab === t ? "border-b-2 border-green-600 font-semibold" : ""
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="bg-white p-6 rounded-3xl shadow">
          Project summary and timeline info.
        </div>
      )}

      {tab === "photos" && <PhotoGallery />}

      {tab === "budget" && (
        <div className="bg-white p-6 rounded-3xl shadow">
          Budget breakdown section.
        </div>
      )}
    </div>
  );
}