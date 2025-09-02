import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { PropertyFormData, FormStep } from '../types';
import { useApp } from '../context/AppContext';

// Form Steps (reuse existing components)
import DetailsStep from '../components/form/DetailsStep';
import DocumentsStep from '../components/form/DocumentsStep';
import IntentStep from '../components/form/IntentStep';
import LocationStep from '../components/form/LocationStep';
import MediaStep from '../components/form/MediaStep';
import ReviewStep from '../components/form/ReviewStep';

const steps: { key: FormStep; title: string; component: React.ComponentType<any> }[] = [
  { key: 'details', title: 'Details', component: DetailsStep },
  { key: 'documents', title: 'Documents', component: DocumentsStep },
  { key: 'intent', title: 'Intent', component: IntentStep },
  { key: 'location', title: 'Location', component: LocationStep },
  { key: 'media', title: 'Media', component: MediaStep },
  { key: 'review', title: 'Review', component: ReviewStep }
];

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, updateProperty } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const property = properties.find(p => p.id === id);

  const methods = useForm<PropertyFormData>({
    defaultValues: {
      title: '',
      type: 'apartment',
      bhk: '',
      address: '',
      city: '',
      area: 0,
      price: 0,
      listingIntent: 'sale',
      amenities: [],
      description: '',
      images: [],
      videos: [],
      documents: [],
      requiredDocuments: [],
      biddingEnabled: false,
      state: '',
      pincode: '',
      landmark: '',
      termsAccepted: false
    }
  });

  // Load property data
  useEffect(() => {
    if (property) {
      methods.setValue('title', property.title);
      methods.setValue('type', property.type);
      methods.setValue('bhk', property.bhk);
      methods.setValue('address', property.address);
      methods.setValue('city', property.city);
      methods.setValue('area', property.area);
      methods.setValue('price', property.price);
      methods.setValue('listingIntent', property.listingIntent);
      methods.setValue('amenities', property.amenities);
      methods.setValue('description', property.description);
      methods.setValue('biddingEnabled', property.biddingEnabled || false);
      methods.setValue('coordinates', property.coordinates);
      methods.setValue('state', property.state || '');
      methods.setValue('pincode', property.pincode || '');
      methods.setValue('landmark', property.landmark || '');
      methods.setValue('termsAccepted', true); // Already accepted in original submission
    }
  }, [property, methods]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: PropertyFormData) => {
    if (!property) return;
    
    try {
      setIsSubmitting(true);
      
      // Update property (price remains locked)
      const updatedData = {
        ...data,
        price: property.price, // Keep original price
        images: data.images.length > 0 ? data.images.map(file => URL.createObjectURL(file)) : property.images,
        videos: data.videos?.length > 0 ? data.videos.map(file => URL.createObjectURL(file)) : property.videos
      };

      updateProperty(property.id, updatedData);
      navigate(`/property/${property.id}`);
    } catch (error) {
      console.error('Failed to update property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!property) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Property Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-background-light z-50 overflow-y-auto"
      style={{ paddingTop: '80px', paddingLeft: '64px' }}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/property/${id}`)}
            className="flex items-center text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Property Details
          </button>

          <div className="text-sm text-text-muted">
            Editing: {property.title}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-text-muted'
                  }`}
                >
                  {index < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? 'text-primary' : 'text-text-muted'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <CurrentStepComponent
                onNext={handleNext}
                onPrev={handlePrev}
                onSubmit={currentStep === steps.length - 1 ? handleSubmit : undefined}
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
                isEdit={true}
              />
            </form>
          </FormProvider>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-text-primary">Updating property...</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EditProperty;