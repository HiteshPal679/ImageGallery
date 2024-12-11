import React from "react";
import { Link } from "react-router-dom";

const Grid = ({ photos, numPhotos, loading }) => {
  const columns = `grid-cols-${numPhotos}`;

  if (loading) {
    return (
      <div className={`grid ${columns} gap-4`}>
        {Array.from({ length: numPhotos }).map((_, index) => (
          <div
            key={index}
            className="w-full h-60 bg-gray-300 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return <p className="text-center text-gray-600">No photos found.</p>;
  }

  return (
    <div className={`grid ${columns} gap-4`}>
      {photos.map((photo) => (
        <Link
          to={`/photo/${photo.id}`}
          key={photo.id}
          className="relative overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
        >
          <img
            src={photo.src.medium}
            alt={photo.alt}
            className="w-full h-60 object-cover rounded-lg"
          />
          <p className="absolute bottom-2 left-2 text-white bg-black opacity-50 px-2 py-1 rounded">
            {photo.photographer}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Grid;
