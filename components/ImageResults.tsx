'use client';

import React from 'react';
import { PixabayImage } from '../lib/pixabay';
import Image from 'next/image';
import Masonry from 'react-masonry-css';

interface ImageResultsProps {
  images: PixabayImage[];
  onSelectImage: (image: PixabayImage | null) => void;
}

const ImageResults: React.FC<ImageResultsProps> = ({ images, onSelectImage }) => {

  const breakpointColumnsObj = {
    default: 4, 
    1100: 3,  
    700: 2,    
    500: 1,    
  };

  return (
    <div className="mt-8">
      {images.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="mb-4 cursor-pointer relative group"
              onClick={() => onSelectImage(image)}
            >
              <Image
                src={image.webformatURL}
                alt={image.tags}
                width={image.imageWidth}
                height={image.imageHeight}
                className="w-full h-auto rounded-lg shadow-md transition-transform group-hover:scale-105"
                unoptimized 
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Add Captions
                </span>
              </div>
            </div>
          ))}
        </Masonry>
      ) : (
        <p className="text-center text-gray-500">No images found.</p>
      )}
    </div>
  );
};

export default ImageResults;