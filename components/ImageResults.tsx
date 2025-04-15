'use client';

import React from 'react';
import { PixabayImage } from '../lib/pixabay';
import Image from 'next/image';

interface ImageResultsProps {
  images: PixabayImage[];
  onSelectImage: (image: PixabayImage) => void;
}

const ImageResults: React.FC<ImageResultsProps> = ({ images, onSelectImage }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <Image
            src={image.webformatURL}
            alt={`Image by ${image.user}`}
            width={400}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => onSelectImage(image)}
            className="absolute bottom-2 right-2 bg-cyan-700 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer hover:bg-cyan-500 "
          >
            Add Captions
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageResults;