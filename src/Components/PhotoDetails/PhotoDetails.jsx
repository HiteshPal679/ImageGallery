import React from "react";
import { useParams, Link } from "react-router-dom";

const PhotoDetails = ({ photoData = [] }) => {
  const { id } = useParams();
  const photo = photoData.find((p) => p.id.toString() === id);

  if (!photo) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 text-lg">Photo not found!</p>
        <Link
          to="/"
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Photo Details</h1>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-4">
        {/* Full Resolution Image */}
        <div className="mb-4">
          <img
            src={photo.src.original}
            alt={photo.alt}
            className="w-full h-auto rounded-md"
          />
        </div>

        {/* Photographer Information */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Photographer</h2>
          <p>{photo.photographer || "Unknown"}</p>
          {photo.photographer_url && (
            <a
              href={photo.photographer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Photographer's Profile
            </a>
          )}
        </div>

        {/* Image Details */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Image Details</h2>
          <p>
            Resolution: {photo.width} x {photo.height}
          </p>
        </div>

        {/* Download Original Image */}
        <div>
          <a
            href={photo.src.original}
            download={`photo_${photo.id}.jpg`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Download Original Image
          </a>
        </div>

        {/* Back Button */}
        <div className="mt-4">
          <Link
            to="/"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;
