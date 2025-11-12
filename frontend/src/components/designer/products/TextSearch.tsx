import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ProductCategory } from '@/types';

interface TextSearchProps {
  onSearch: (query: string, category: ProductCategory | 'all') => void;
}

const TextSearch: React.FC<TextSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, category);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, description, or tags..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent"
        />
      </div>
      
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as ProductCategory | 'all')}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white"
      >
        <option value="all">All Categories</option>
        <option value={ProductCategory.FURNITURE}>Furniture</option>
        <option value={ProductCategory.LIGHTING}>Lighting</option>
        <option value={ProductCategory.DECORATION}>Decoration</option>
        <option value={ProductCategory.TEXTILE}>Textile</option>
        <option value={ProductCategory.STORAGE}>Storage</option>
        <option value={ProductCategory.APPLIANCE}>Appliance</option>
      </select>
      
      <button
        type="submit"
        className="px-6 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors flex items-center gap-2"
      >
        <Search size={20} />
        Search
      </button>
    </form>
  );
};

export default TextSearch;