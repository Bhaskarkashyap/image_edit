'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { PixabayImage } from '../lib/pixabay';

interface CanvasEditorProps {
  image: PixabayImage | null;
  onClose: () => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ image, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textColor, setTextColor] = useState('#000000'); // Default text color

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
    });

    // Update color picker when text is selected
    fabricCanvasRef.current.on('selection:created', (e) => {
      const activeObject = e.target;
      if (activeObject instanceof fabric.IText) {
        setTextColor(activeObject.fill as string || '#000000');
      }
    });
    fabricCanvasRef.current.on('selection:updated', (e) => {
      const activeObject = e.target;
      if (activeObject instanceof fabric.IText) {
        setTextColor(activeObject.fill as string || '#000000');
      }
    });
    fabricCanvasRef.current.on('selection:cleared', () => {
      setTextColor('#000000'); // Reset to default
    });

    // Handle Delete key press to remove selected shape or text
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && fabricCanvasRef.current) {
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (
          activeObject &&
          (activeObject instanceof fabric.Triangle ||
           activeObject instanceof fabric.Circle ||
           activeObject instanceof fabric.Rect ||
           activeObject instanceof fabric.Polygon ||
           activeObject instanceof fabric.IText)
        ) {
          fabricCanvasRef.current.remove(activeObject);
          fabricCanvasRef.current.discardActiveObject();
          fabricCanvasRef.current.renderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      fabricCanvasRef.current?.dispose();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (image && fabricCanvasRef.current) {
      fabric.Image.fromURL(image.largeImageURL, (img) => {
        if (!fabricCanvasRef.current) return;
        img.scaleToWidth(800);
        img.scaleToHeight(600);
        fabricCanvasRef.current.setBackgroundImage(img, () => {
          fabricCanvasRef.current?.renderAll();
        });
      }, { crossOrigin: 'anonymous' });
    }
  }, [image]);

  const addText = () => {
    if (!fabricCanvasRef.current) return;
    const text = new fabric.IText('Edit me', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: textColor, // Use selected color
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const changeTextColor = (color: string) => {
    setTextColor(color);
    const activeObject = fabricCanvasRef.current?.getActiveObject();
    if (activeObject instanceof fabric.IText) {
      activeObject.set({ fill: color });
      fabricCanvasRef.current?.renderAll();
    }
  };

  const addShape = (shapeType: 'triangle' | 'circle' | 'rectangle' | 'polygon') => {
    if (!fabricCanvasRef.current) return;
    let shape: fabric.Object;

    switch (shapeType) {
      case 'triangle':
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: 'rgba(255,0,0,0.5)',
          left: 100,
          top: 100,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          fill: 'rgba(0,255,0,0.5)',
          left: 100,
          top: 100,
        });
        break;
      case 'rectangle':
        shape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: 'rgba(0,0,255,0.5)',
          left: 100,
          top: 100,
        });
        break;
      case 'polygon':
        shape = new fabric.Polygon(
          [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 50, y: 100 },
          ],
          {
            fill: 'rgba(255,255,0,0.5)',
            left: 100,
            top: 100,
          }
        );
        break;
      default:
        return;
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
  };

  const downloadImage = () => {
    if (!fabricCanvasRef.current) return;
    try {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'edited-image.png';
      link.click();
    } catch (err) {
      setError('Failed to download image. Please try again.');
      console.log(err);
    }
  };

  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-8 rounded-xl shadow-lg max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Edit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200 text-2xl font-bold cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        {/* Canvas */}
        <canvas ref={canvasRef} className="w-full border border-gray-300 rounded mb-6" />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-start pt-5">
          <button
            onClick={addText}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Add Text
          </button>
          <div className="flex items-center gap-2">
            <label htmlFor="text-color" className="text-white text-sm">
              Text Color
            </label>
            <input
              id="text-color"
              type="color"
              value={textColor}
              onChange={(e) => changeTextColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>
          <button
            onClick={() => addShape('triangle')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Triangle
          </button>
          <button
            onClick={() => addShape('circle')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Circle
          </button>
          <button
            onClick={() => addShape('rectangle')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Rectangle
          </button>
          <button
            onClick={() => addShape('polygon')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Polygon
          </button>
          <button
            onClick={downloadImage}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;