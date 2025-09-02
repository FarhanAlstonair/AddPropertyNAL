import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';
import { availableAmenities } from '../../utils/mockData';

const IntentStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { register, formState: { errors }, trigger, watch, setValue } = useFormContext<PropertyFormData>();
  const selectedAmenities = watch('amenities') || [];

  const handleNext = async () => {
    const isValid = await trigger(['listingIntent']);
    if (isValid) onNext();
  };

  const toggleAmenity = (amenity: string) => {
    const current = selectedAmenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    setValue('amenities', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Listing Intent & Amenities</h2>
        <p className="text-text-muted">Specify your listing purpose and property amenities</p>
      </div>

      <div className="space-y-8">
        {/* Listing Intent */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-4">
            Listing Intent *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="relative">
              <input
                type="radio"
                value="sale"
                {...register('listingIntent', { required: 'Please select listing intent' })}
                className="sr-only peer"
              />
              <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">For Sale</div>
                  <div className="text-sm opacity-75">Sell your property</div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                value="rent"
                {...register('listingIntent', { required: 'Please select listing intent' })}
                className="sr-only peer"
              />
              <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">For Rent</div>
                  <div className="text-sm opacity-75">Rent out your property</div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                value="urgent-sale"
                {...register('listingIntent', { required: 'Please select listing intent' })}
                className="sr-only peer"
              />
              <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors peer-checked:border-primary peer-checked:bg-red-600 peer-checked:text-white">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">Urgent Sale</div>
                  <div className="text-sm opacity-75">Quick sale needed</div>
                </div>
              </div>
            </label>
          </div>
          {errors.listingIntent && (
            <p className="mt-2 text-sm text-red-600">{errors.listingIntent.message}</p>
          )}
        </div>

        {/* Enable Bidding */}
        <div>
          <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-primary transition-colors">
            <input
              type="checkbox"
              {...register('biddingEnabled')}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <div>
              <div className="font-medium text-text-primary">Enable Bidding</div>
              <div className="text-sm text-text-muted">Allow buyers to place bids on this property</div>
            </div>
          </label>
        </div>

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