import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';
import { availableCities } from '../../utils/mockData';

const LocationStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { register, formState: { errors }, trigger } = useFormContext<PropertyFormData>();

  const handleNext = async () => {
    const isValid = await trigger(['address', 'city']);
    if (isValid) onNext();
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

        {/* Address Input with Auto-suggest */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Search Address (Google Places)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Start typing address for suggestions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-sm text-text-muted mt-1">
            Google Places API integration ready for auto-complete
          </div>
        </div>

        {/* Map Preview */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Location Preview
          </label>
          <div className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
            <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
              <div className="text-center p-6">
                <svg className="mx-auto w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div className="font-medium text-blue-900 mb-1">Interactive Map</div>
                <div className="text-sm text-blue-700">Pin will appear here when address is selected</div>
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