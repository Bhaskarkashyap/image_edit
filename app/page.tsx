'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import ImageResults from '../components/ImageResults';
import CanvasEditor from '../components/CanvasEditor';
import { PixabayImage } from '../lib/pixabay';
import Navbar from '@/components/Navbar';
import DefaultImages from '@/components/DefaultImages';
import SearchBar from '@/components/Searchbar';

export default function Home() {
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<PixabayImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); 

  const handleSearch = async (query: string) => {
    setError(null);
    setLoading(true);
    setHasSearched(true); 
    setImages([]); 
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const results = await response.json();
      setImages(results);
    } catch (err) {
      setError('Failed to fetch images. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImages([]);
    setError(null); 
    setLoading(false);
    setHasSearched(false); 
  };

  return (
    <main className="min-h-screen p-8 relative">
      <Navbar />
      <div className="w-full bg-white"></div>
      <SearchBar onSearch={handleSearch} onClear={handleClear} />
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center pt-5"
        >
          <p>Loading...</p>
        </motion.div>
      ) : images.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ImageResults images={images} onSelectImage={setSelectedImage} />
        </motion.div>
      ) : (
        !hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center pt-26"
          >
            <DefaultImages onSelectImage={setSelectedImage} />
          </motion.div>
        )
      )}
      {selectedImage && (
        <CanvasEditor image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </main>
  );
}