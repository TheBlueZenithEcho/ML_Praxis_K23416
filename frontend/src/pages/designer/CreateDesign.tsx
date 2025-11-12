import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Save, Send } from 'lucide-react';
import { RoomType, DesignStyle, DesignStatus } from '@/types';
import type { Product } from '@/types';
import ProductSearchOverlay from '@/components/designer/products/ProductSearchOverlay';

const CreateDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomType, setRoomType] = useState<RoomType>(RoomType.LIVING_ROOM);
  const [style, setStyle] = useState<DesignStyle>(DesignStyle.MODERN);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [showProductSearch, setShowProductSearch] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex(prev => prev - 1);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleProductSelect = (product: Product, quantity: number) => {
    setSelectedProducts(prev => [...prev, { product, quantity }]);
    setShowProductSearch(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.product.id !== productId));
  };

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    setSelectedProducts(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const validateForm = (requireProducts: boolean = true) => {
    if (!title.trim()) {
      alert('Please enter a design title');
      return false;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return false;
    }
    if (images.length === 0) {
      alert('Please upload at least one image');
      return false;
    }
    if (requireProducts && selectedProducts.length === 0) {
      alert('Please add at least one product to submit for approval');
      return false;
    }
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;
    setIsSaving(true);
    try {
      // TODO: Call API (POST/PUT) to save as draft
      console.log('Saving as draft:', { /* ... */ });
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Design saved as draft successfully!');
      navigate('/designer/designs');
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Failed to save design. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    setIsSubmitting(true);
    try {
      // TODO: Call API (POST/PUT) to submit for approval
      console.log('Submitting for approval:', { /* ... */ });
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Design submitted for approval! Admin will review it soon.');
      navigate('/designer/designs');
    } catch (error) {
      console.error('Failed to submit design:', error);
      alert('Failed to submit design. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header (đã hỗ trợ dark mode) */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/designer/designs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            Back to Designs
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Design</h1>
          <p className="text-gray-600 dark:text-gray-300">Create and save your design, then submit it for admin approval</p>
        </div>

        {/* Form (đã hỗ trợ dark mode) */}
        <form className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Design Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Modern Minimalist Living Room"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe your design concept, key features, and inspiration..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Room Type & Style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Room Type *
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.values(RoomType).map(type => (
                  <option key={type} value={type}>
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Design Style *
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as DesignStyle)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.values(DesignStyle).map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (press Enter)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                <Plus size={20} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#E6F3E6] text-[#2B7516] rounded-full text-sm flex items-center gap-2 dark:bg-green-900/50 dark:text-green-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Design Images * (First image will be thumbnail)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#2B7516] dark:hover:border-green-500 transition-colors">
              <Upload size={32} className="text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Click to upload images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className={`w-full aspect-square object-cover rounded-lg ${
                        index === thumbnailIndex ? 'ring-4 ring-[#2B7516]' : ''
                      }`}
                    />
                    {index === thumbnailIndex && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-[#2B7516] text-white text-xs rounded">
                        Thumbnail
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index !== thumbnailIndex && (
                      <button
                        type="button"
                        onClick={() => setThumbnailIndex(index)}
                        className="absolute bottom-2 left-2 px-2 py-1 bg-white text-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-800 dark:text-gray-200"
                      >
                        Set as thumbnail
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Related Products {selectedProducts.length === 0 && <span className="text-orange-600 dark:text-orange-400">(Required for submission)</span>}
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Add products that are featured in this design. You can save as draft without products.
            </p>
            
            {selectedProducts.length > 0 && (
              <div className="space-y-3 mb-4">
                {selectedProducts.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    {/* Product Image */}
                    <img
                      src={product.thumbnailImage}
                      alt={product.name}
                      className="w-20 h-20 rounded object-cover flex-shrink-0"
                    />
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Price: <span className="font-semibold text-[#2B7516]">{formatPrice(product.price)}</span>
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          Stock: <span className="font-semibold dark:text-white">{product.stock}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateProductQuantity(product.id, quantity - 1)}
                        className="p-2 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stock}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => updateProductQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="p-2 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded transition-colors"
                      title="Remove product"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-[#E6F3E6] dark:bg-green-900/50 rounded-lg border border-[#2B7516] dark:border-green-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Value</span>
                  <span className="text-xl font-bold text-[#2B7516]">
                    {formatPrice(
                      selectedProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
                    )}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowProductSearch(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:border-[#2B7516] hover:text-[#2B7516] hover:bg-[#E6F3E6] dark:hover:border-green-500 dark:hover:text-green-300 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add Products to Design
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t dark:border-t-gray-700">
            <button
              type="button"
              onClick={() => navigate('/designer/designs')}
              disabled={isSaving || isSubmitting}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || isSubmitting}
              className="flex-1 px-6 py-3 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-blue-600 dark:text-blue-300 flex-shrink-0">ℹ️</div>
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <p className="font-semibold mb-1">Save vs Submit:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Save as Draft:</strong> Save your work without products for later editing</li>
                  <li><strong>Submit for Approval:</strong> Send completed design with products to admin for review and catalog publication</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Product Search Overlay */}
      <ProductSearchOverlay
        isOpen={showProductSearch}
        onClose={() => setShowProductSearch(false)}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
};

export default CreateDesignPage;