import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';

const MediaStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { setValue, watch } = useFormContext<PropertyFormData>();
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);
    setValue('images', newImages);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newVideos = [...videos, ...files];
    setVideos(newVideos);
    setValue('videos', newVideos);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
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
        {/* Images Section */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Property Images</h3>
          
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
                Click to upload images
              </div>
              <div className="text-text-muted">
                JPG, PNG, GIF up to 5MB each
              </div>
            </label>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-text-primary mb-3">Uploaded Images ({images.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        Cover Photo
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
            <li>• Include photos of all rooms and key features</li>
            <li>• The first image will be used as the cover photo</li>
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