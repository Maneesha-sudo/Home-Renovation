import React from "react";

export default function PhotoCard({ photo }) {
  return (
    <div className="bg-white shadow rounded p-2 m-2 w-48">
      <img
        src={photo.url} // URL from your backend or Supabase storage
        alt={photo.description || "Project Photo"}
        className="w-full h-32 object-cover rounded"
      />
      {photo.description && (
        <p className="text-sm text-gray-600 mt-1">{photo.description}</p>
      )}
      <p className="text-xs text-gray-400">
        {new Date(photo.uploadedAt).toLocaleDateString()}
      </p>
    </div>
  );
}