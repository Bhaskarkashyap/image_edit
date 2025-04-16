'use client';

import React, { useEffect, useState } from 'react';
import { PixabayImage, searchImages } from '../lib/pixabay';
import Image from 'next/image';
import Masonry from 'react-masonry-css';

interface DefaultImagesProps {
  onSelectImage: (image: PixabayImage | null) => void;
}

const DefaultImages: React.FC<DefaultImagesProps> = ({ onSelectImage }) => {
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefaultImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchImages('nature', 12); 
        setImages(results);
      } catch (err) {
        setError('Failed to load default images. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultImages();
  }, []);


  const breakpointColumnsObj = {
    default: 4, 
    1100: 3,   
    700: 2,   
    500: 1,  
  };

  return (
    <div >
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center">Loading default images...</p>}
      {images.length > 0 && (
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
              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Add Captions
                </span>
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default DefaultImages;