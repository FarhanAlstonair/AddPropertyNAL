import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';
import { availableCities } from '../../utils/mockData';
import GoogleMap from '../GoogleMap';

const LocationStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { register, formState: { errors }, trigger, watch, setValue } = useFormContext<PropertyFormData>();
  const [showCoordinates, setShowCoordinates] = useState(false);
  const coordinates = watch('coordinates');

  const handleNext = async () => {
    const isValid = await trigger(['address', 'city', 'state', 'pincode']);
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
        {/* Free-Form Address Entry */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Property Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('address', { required: '⚠ Please provide the property address.' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter property address..."
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Location Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              State *
            </label>
            <input
              type="text"
              {...register('state', { required: 'State is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Maharashtra"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>
          
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
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Pincode *
            </label>
            <input
              type="text"
              {...register('pincode', { 
                required: 'Pincode is required',
                pattern: { value: /^[0-9]{6}$/, message: 'Enter valid 6-digit pincode' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 400001"
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Landmark
            </label>
            <input
              type="text"
              {...register('landmark')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Near Metro Station"
            />
          </div>
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
            Add coordinates for precise map location. If not provided, default map will show Bengaluru.
          </div>
        </div>

        {/* Interactive Map */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Interactive Map - Click to set location
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <GoogleMap
              address={watch('address')}
              coordinates={coordinates || { lat: 12.9716, lng: 77.5946 }} // Default to Bengaluru
              onLocationSelect={(location) => {
                setValue('coordinates', { lat: location.lat, lng: location.lng });
              }}
              height="300px"
            />
          </div>
          {coordinates?.lat && coordinates?.lng && (
            <p className="mt-2 text-sm text-green-600">
              📍 Location set: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          )}
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