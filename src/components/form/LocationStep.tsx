import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';
import { availableCities } from '../../utils/mockData';

const LocationStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { register, formState: { errors }, trigger, watch, setValue } = useFormContext<PropertyFormData>();
  const [showCoordinates, setShowCoordinates] = useState(false);
  const coordinates = watch('coordinates');

  const handleNext = async () => {
    const isValid = await trigger(['address', 'city']);
    if (isValid) onNext();
  };

  const handleCoordinateChange = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setValue('coordinates', {
        lat: coordinates?.lat || 0,
        lng: coordinates?.lng || 0,
        [field]: numValue
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Property Location</h2>
        <p className="text-text-muted">Provide the complete address of your property</p>
      </div>

      <div className="space-y-6">
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Complete Address *
          </label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter complete address including street, area, landmarks..."
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            City *
          </label>
          <select
            {...register('city', { required: 'City is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select City</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* Coordinates Input */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-text-secondary">
              Location Coordinates (Optional)
            </label>
            <button
              type="button"
              onClick={() => setShowCoordinates(!showCoordinates)}
              className="text-sm text-primary hover:underline"
            >
              {showCoordinates ? 'Hide' : 'Add'} Coordinates
            </button>
          </div>
          
          {showCoordinates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 19.0760"
                  value={coordinates?.lat || ''}
                  onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 72.8777"
                  value={coordinates?.lng || ''}
                  onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          <div className="text-sm text-text-muted">
            Add coordinates for precise map location. If not provided, default India map will be shown.
          </div>
        </div>

        {/* Map Preview */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Map Preview
          </label>
          <div className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
            <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
              <div className="text-center p-6">
                <svg className="mx-auto w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div className="font-medium text-blue-900 mb-1">
                  {coordinates?.lat && coordinates?.lng ? 'Property Location' : 'Default India Map'}
                </div>
                <div className="text-sm text-blue-700">
                  {coordinates?.lat && coordinates?.lng 
                    ? `Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}`
                    : 'No coordinates provided - showing India map'
                  }
                </div>
                <div className="text-xs text-blue-600 mt-2">Google Maps integration ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Location Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Include nearby landmarks for easy identification</li>
            <li>• Mention proximity to schools, hospitals, or transport hubs</li>
            <li>• Be specific about the area/locality name</li>
            <li>• Include pin code if available</li>
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
          onClick={handleNext}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          Next: Media
        </button>
      </div>
    </div>
  );
};

export default LocationStep;