'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/Searchbar';
import ImageResults from '../components/ImageResults';
import CanvasEditor from '../components/CanvasEditor';
import {PixabayImage } from '../lib/pixabay';
import Image from 'next/image';

export default function Home() {
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<PixabayImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const results = await response.json();
      setImages(results);
    } catch (err) {
      setError('Failed to fetch images. Please try again.');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };
  const handleClear = () => {
    setImages([]); // Clear images
    setError(null); // Clear errors
    setLoading(false); // Reset loading state
  };


  return (
    <main className="min-h-screen p-8  relative">
 
      <h1 className="text-xl font-bold mb-8">Image Editor</h1>
      <div className='w-full bg-white'></div>
      <SearchBar onSearch={handleSearch} onClear={handleClear}  />
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center">Loading...</p>}
      {images.length > 0 ? (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <ImageResults images={images} onSelectImage={setSelectedImage} />
  </motion.div>
) : (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="text-center pt-52"
  >
    <h2 className="text-2xl font-semibold mb-4">
      Welcome to Image Editor
    </h2>
    <p className="text-gray-500 max-w-md mx-auto">
      Search for images using the box above to start editing with captions and shapes!
    </p>
  </motion.div>
)}
      {selectedImage && (
        <CanvasEditor image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </main>
  );
}