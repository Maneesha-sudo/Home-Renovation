import { useState } from "react";
import toast from "react-hot-toast";

export default function ProgressPhotos({ taskId, taskTitle }) {
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);

  // Convert file to preview URL
  const handleUpload = (e, type) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    if (type === "before") {
      setBeforePhotos((prev) => [...prev, ...imagePreviews]);
    } else {
      setAfterPhotos((prev) => [...prev, ...imagePreviews]);
    }

    toast.success("Photo uploaded successfully!");
  };

  const removePhoto = (id, type) => {
    if (type === "before") {
      setBeforePhotos((prev) => prev.filter((p) => p.id !== id));
    } else {
      setAfterPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-4">
      <h3 className="text-lg font-semibold">
        📸 Progress Photos — {taskTitle}
      </h3>

      {/* BEFORE SECTION */}
      <div>
        <p className="font-medium text-gray-600 mb-2">Before Photos</p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e, "before")}
          className="mb-3"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {beforePhotos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.preview}
                alt="Before"
                className="rounded-xl h-32 w-full object-cover"
              />
              <button
                onClick={() => removePhoto(photo.id, "before")}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AFTER SECTION */}
      <div>
        <p className="font-medium text-gray-600 mb-2">After Photos</p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e, "after")}
          className="mb-3"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {afterPhotos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.preview}
                alt="After"
                className="rounded-xl h-32 w-full object-cover"
              />
              <button
                onClick={() => removePhoto(photo.id, "after")}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}