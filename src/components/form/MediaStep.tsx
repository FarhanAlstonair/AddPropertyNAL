import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';

const MediaStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { setValue, watch, register } = useFormContext<PropertyFormData>();
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imageCategories, setImageCategories] = useState<{ [key: string]: File[] }>({});
  const [selectedCategory, setSelectedCategory] = useState('Property Images');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  const baseCategories = ['Property Images', 'Cover Image', 'Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Exterior', 'Other'];
  
  const getAvailableCategories = () => {
    return baseCategories.filter(category => {
      if (category === 'Cover Image' && coverImage) return false;
      return true;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedCategory === 'Cover Image') {
      if (files.length > 0) {
        setCoverImage(files[0]);
        const newImages = [files[0], ...images];
        setImages(newImages);
        setValue('images', newImages);
      }
    } else {
      const newImages = [...images, ...files];
      setImages(newImages);
      setValue('images', newImages);
      
      // Add to selected category
      const categoryName = selectedCategory === 'Other' ? customCategory : selectedCategory;
      const updatedCategories = {
        ...imageCategories,
        [categoryName]: [...(imageCategories[categoryName] || []), ...files]
      };
      setImageCategories(updatedCategories);
      setValue('imageCategories', updatedCategories);
    }
    
    e.target.value = '';
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newVideos = [...videos, ...files];
    setVideos(newVideos);
    setValue('videos', newVideos);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    
    // Check if it's cover image
    if (imageToRemove === coverImage) {
      setCoverImage(null);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
    
    // Remove from categories
    const updatedCategories = { ...imageCategories };
    Object.keys(updatedCategories).forEach(category => {
      updatedCategories[category] = updatedCategories[category].filter(img => img !== imageToRemove);
    });
    setImageCategories(updatedCategories);
    setValue('imageCategories', updatedCategories);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    setValue('videos', newVideos);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Property Media</h2>
        <p className="text-text-muted">Upload images and videos to showcase your property</p>
      </div>

      <div className="space-y-8">
        {/* Virtual Tour */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">360° Virtual Tour (Optional)</h3>
          <p className="text-sm text-text-muted mb-4">Add a virtual tour link or upload 360° content</p>
          
          <input
            type="url"
            {...register('virtualTour')}
            placeholder="https://example.com/virtual-tour or upload 360° file"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Images Section */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Property Images</h3>
          
          {/* Category Selection */}
          <div className="mb-4 space-y-3">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Select Category for Upload
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setShowCustomInput(e.target.value === 'Other');
              }}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {getAvailableCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {/* Custom Category Input */}
            {showCustomInput && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    setSelectedCategory('Property Images');
                    setCustomCategory('');
                  }}
                  className="px-3 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="images-upload"
            />
            <label htmlFor="images-upload" className="cursor-pointer">
              <svg className="mx-auto w-12 h-12 text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-lg font-medium text-text-primary mb-2">
                Upload to {selectedCategory === 'Other' ? (customCategory || 'Custom Category') : selectedCategory}
              </div>
              <div className="text-text-muted">
                JPG, PNG, GIF up to 5MB each
              </div>
            </label>
          </div>

          {/* Cover Image Display */}
          {coverImage && (
            <div className="mt-6">
              <h4 className="font-medium text-text-primary mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 0 0 14-14 0z" />
                </svg>
                Cover Image
              </h4>
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Cover Image"
                  className="w-48 h-32 object-cover rounded-lg border-2 border-primary"
                />
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Cover Photo
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const coverIndex = images.indexOf(coverImage);
                    if (coverIndex !== -1) removeImage(coverIndex);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Categorized Image Preview */}
          {Object.keys(imageCategories).length > 0 && (
            <div className="mt-6 space-y-6">
              {Object.entries(imageCategories).map(([category, categoryImages]) => (
                categoryImages.length > 0 && (
                  <div key={category}>
                    <h4 className="font-medium text-text-primary mb-3">{category} ({categoryImages.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categoryImages.map((file, index) => {
                        const globalIndex = images.indexOf(file);
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`${category} ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(globalIndex)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {file === coverImage && (
                              <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                Cover Photo
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                              {category}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Videos Section */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Property Video Tour (Optional)</h3>
          <p className="text-sm text-text-muted mb-4">Upload a video tour to showcase your property (recommended)</p>
          
          {/* Video Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
              id="videos-upload"
            />
            <label htmlFor="videos-upload" className="cursor-pointer">
              <svg className="mx-auto w-12 h-12 text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="text-base font-medium text-text-primary mb-1">
                Upload Property Video
              </div>
              <div className="text-text-muted">
                MP4, MOV, AVI up to 50MB (single video recommended)
              </div>
            </label>
          </div>

          {/* Video Preview List */}
          {videos.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-text-primary mb-3">Uploaded Videos ({videos.length})</h4>
              <div className="space-y-3">
                {videos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background-light rounded-lg">
                    <div className="flex items-center">
                      <div className="w-16 h-12 bg-gray-300 rounded flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{file.name}</div>
                        <div className="text-sm text-text-muted">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Media Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Media Tips:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Upload high-quality, well-lit images</li>
            <li>• Categorize images by room type for better organization</li>
            <li>• Select 'Cover Image' category to set your main property photo</li>
            <li>• Use 'Property Images' for general property photos that appear in carousel</li>
            <li>• Add 360° virtual tour for immersive experience</li>
            <li>• Videos can showcase the property walkthrough</li>
            <li>• Avoid blurry or dark images</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          Next: Review
        </button>
      </div>
    </div>
  );
};

export default MediaStep;