import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';
import { availableAmenities } from '../../utils/mockData';

const IntentStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { register, formState: { errors }, trigger, watch, setValue } = useFormContext<PropertyFormData>();
  const selectedAmenities = watch('amenities') || [];
  const customAmenities = watch('customAmenities') || [];
  const [newCustomAmenity, setNewCustomAmenity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleNext = async () => {
    onNext();
  };

  const toggleAmenity = (amenity: string) => {
    const current = selectedAmenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    setValue('amenities', updated);
  };

  const addCustomAmenity = () => {
    if (newCustomAmenity.trim() && !customAmenities.includes(newCustomAmenity.trim())) {
      const updated = [...customAmenities, newCustomAmenity.trim()];
      setValue('customAmenities', updated);
      setNewCustomAmenity('');
      setShowCustomInput(false);
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    const updated = customAmenities.filter(a => a !== amenity);
    setValue('customAmenities', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Property Amenities</h2>
        <p className="text-text-muted">Select amenities and features available in your property</p>
      </div>

      <div className="space-y-8">
        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-4">
            Property Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? 'border-primary bg-primary bg-opacity-10 text-primary'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                    selectedAmenities.includes(amenity)
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedAmenities.includes(amenity) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{amenity}</span>
                </div>
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-text-muted">
            Selected: {selectedAmenities.length} amenities
          </p>
        </div>

        {/* Custom Amenities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-text-secondary">
              Custom Amenities
            </label>
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="text-sm text-primary hover:underline flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Custom Amenity
            </button>
          </div>

          {showCustomInput && (
            <div className="mb-4 p-4 border border-gray-300 rounded-lg">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newCustomAmenity}
                  onChange={(e) => setNewCustomAmenity(e.target.value)}
                  placeholder="Enter custom amenity (e.g., Solar Panels)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()}
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    setNewCustomAmenity('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {customAmenities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-secondary">Your Custom Amenities:</h4>
              <div className="flex flex-wrap gap-2">
                {customAmenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomAmenity(amenity)}
                      className="ml-2 text-primary hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          Next: Location
        </button>
      </div>
    </div>
  );
};

export default IntentStep;