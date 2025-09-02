import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';

interface ReviewStepProps extends FormStepProps {
  onSubmit: (data: PropertyFormData) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onPrev, onSubmit, isFirst, isLast }) => {
  const { watch, handleSubmit } = useFormContext<PropertyFormData>();
  const formData = watch();

  const formatPrice = (price: number, intent: string) => {
    if (intent === 'rent') {
      return `₹${price?.toLocaleString()}/month`;
    }
    if (intent === 'urgent-sale') {
      return `₹${(price / 100000)?.toFixed(1)} Lakhs (Urgent)`;
    }
    return `₹${(price / 100000)?.toFixed(1)} Lakhs`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Review & Submit</h2>
        <p className="text-text-muted">Please review all information before submitting</p>
      </div>

      <div className="space-y-6">
        {/* Property Overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Property Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
              <p className="text-text-primary">{formData.title || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
              <p className="text-text-primary capitalize">{formData.type || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">BHK</label>
              <p className="text-text-primary">{formData.bhk || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Area</label>
              <p className="text-text-primary">{formData.area ? `${formData.area} sq ft` : 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Price</label>
              <p className="text-text-primary font-semibold">
                {formData.price && formData.listingIntent 
                  ? formatPrice(formData.price, formData.listingIntent)
                  : 'Not specified'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Listing Intent</label>
              <p className="text-text-primary capitalize">{formData.listingIntent?.replace('-', ' ') || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Bidding</label>
              <p className="text-text-primary">{formData.biddingEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
          
          {formData.description && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <p className="text-text-primary">{formData.description}</p>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Address</label>
              <p className="text-text-primary">{formData.address || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
              <p className="text-text-primary">{formData.city || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {formData.amenities && formData.amenities.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Amenities ({formData.amenities.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Media</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background-light rounded-lg">
              <div className="text-2xl font-bold text-primary">{formData.images?.length || 0}</div>
              <div className="text-sm text-text-muted">Images</div>
            </div>
            <div className="text-center p-4 bg-background-light rounded-lg">
              <div className="text-2xl font-bold text-primary">{formData.videos?.length || 0}</div>
              <div className="text-sm text-text-muted">Videos</div>
            </div>
            <div className="text-center p-4 bg-background-light rounded-lg">
              <div className="text-2xl font-bold text-primary">{formData.documents?.length || 0}</div>
              <div className="text-sm text-text-muted">Additional Docs</div>
            </div>
            <div className="text-center p-4 bg-background-light rounded-lg">
              <div className="text-2xl font-bold text-primary">{formData.requiredDocuments?.length || 0}</div>
              <div className="text-sm text-text-muted">Required Docs</div>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        {formData.images && formData.images.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Image Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.slice(0, 8).map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 py-0.5 rounded">
                      Cover
                    </div>
                  )}
                </div>
              ))}
              {formData.images.length > 8 && (
                <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-text-muted text-sm">+{formData.images.length - 8} more</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Required Documents Check */}
        {(!formData.requiredDocuments || formData.requiredDocuments.length < 3) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm text-red-800">
                Please upload at least 3 required documents before submitting.
              </span>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 mr-3"
              required
            />
            <label htmlFor="terms" className="text-sm text-blue-900">
              I confirm that all the information provided is accurate and I agree to the{' '}
              <a href="#" className="text-blue-700 underline">Terms and Conditions</a> and{' '}
              <a href="#" className="text-blue-700 underline">Privacy Policy</a>.
            </label>
          </div>
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
        <div className="flex space-x-3">
          <button
            type="button"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!formData.requiredDocuments || formData.requiredDocuments.length < 3}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;