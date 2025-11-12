import React, { useState } from 'react';
import { Image, Search, X } from 'lucide-react';

interface ImageSearchProps {
  onSearch: (file: File) => void;
}

const ImageSearch: React.FC<ImageSearchProps> = ({ onSearch }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = () => {
    if (!imageFile) {
      alert('Please upload an image first');
      return;
    }
    onSearch(imageFile);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2B7516] transition-colors">
          {imagePreview ? (
            <div className="relative w-full h-full p-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleClear();
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Image size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-500 mt-1">
                Upload a photo to find similar products
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
      
      <button
        type="button"
        onClick={handleSearch}
        disabled={!imageFile}
        className="px-6 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Search size={20} />
        Search
      </button>
    </div>
  );
};

export default ImageSearch;