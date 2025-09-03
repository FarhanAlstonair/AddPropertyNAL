import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';

interface DetailsStepProps extends FormStepProps {
  isEdit?: boolean;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ onNext, isFirst, isLast, isEdit }) => {
  const { register, formState: { errors }, trigger } = useFormContext<PropertyFormData>();

  const handleNext = async () => {
    const isValid = await trigger(['title', 'type', 'sellerType', 'bhk', 'area', 'price', 'description']);
    if (isValid) onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Property Details</h2>
        <p className="text-text-muted">Enter basic information about your property</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Property Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Property title is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Luxury 3BHK Apartment in Downtown"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Property Type *
          </label>
          <select
            {...register('type', { required: 'Property type is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* Seller Type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Seller Type *
          </label>
          <select
            {...register('sellerType', { required: 'Seller type is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Seller Type</option>
            <option value="owner">Owner</option>
            <option value="agent">Agent</option>
            <option value="company">Company</option>
          </select>
          {errors.sellerType && (
            <p className="mt-1 text-sm text-red-600">{errors.sellerType.message}</p>
          )}
        </div>

        {/* BHK Configuration */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            BHK Configuration *
          </label>
          <input
            type="text"
            {...register('bhk', { required: 'BHK configuration is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., 3BHK, 2BHK, Studio"
          />
          {errors.bhk && (
            <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Area (sq ft) *
          </label>
          <input
            type="number"
            {...register('area', { 
              required: 'Area is required',
              min: { value: 1, message: 'Area must be greater than 0' }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., 1200"
          />
          {errors.area && (
            <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 1, message: 'Price must be greater than 0' }
            })}
            disabled={isEdit}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="e.g., 8500000"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
          <div className={`mt-2 p-3 rounded-lg ${isEdit ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`text-sm ${isEdit ? 'text-red-800' : 'text-yellow-800'}`}>
              <span className="font-medium">{isEdit ? 'Locked:' : 'Note:'}</span> {isEdit ? 'Property price cannot be changed after initial submission.' : 'Once you set the property price, it cannot be changed later.'}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe your property, its features, and what makes it special..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div></div>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          Next: Documents
        </button>
      </div>
    </div>
  );
};

export default DetailsStep;