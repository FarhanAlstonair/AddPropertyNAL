import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { PropertyFormData, FormStep } from '../types';
import { api } from '../utils/api';
import { useApp } from '../context/AppContext';

// Form Steps
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

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const { addProperty } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      customAmenities: [],
      sellerType: 'owner',
      description: '',
      images: [],
      videos: [],
      virtualTour: '',
      imageCategories: {},
      documents: [],
      requiredDocuments: [],
      projectBrochure: undefined,
      biddingEnabled: false,
      state: '',
      pincode: '',
      landmark: '',
      termsAccepted: false
    }
  });

  // Load draft on mount
  useEffect(() => {
    const draft = api.loadDraft();
    if (draft) {
      Object.keys(draft).forEach(key => {
        const value = draft[key as keyof PropertyFormData];
        if (value !== undefined) {
          methods.setValue(key as keyof PropertyFormData, value);
        }
      });
    }
  }, [methods]);

  // Auto-save draft
  useEffect(() => {
    const subscription = methods.watch((data) => {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      ) as Partial<PropertyFormData>;
      api.saveDraft(cleanData);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

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
    try {
      setIsSubmitting(true);
      
      // Convert files to URLs for demo (in real app, upload to server first)
      const imageCategories: { [key: string]: string[] } = {};
      Object.entries(data.imageCategories || {}).forEach(([category, files]) => {
        imageCategories[category] = files.map(file => URL.createObjectURL(file));
      });
      
      const propertyData = {
        ...data,
        images: data.images.map(file => URL.createObjectURL(file)),
        videos: data.videos?.map(file => URL.createObjectURL(file)) || [],
        imageCategories,
        status: 'active' as const
      };

      await addProperty(propertyData);
      api.clearDraft();
      navigate('/');
    } catch (error) {
      console.error('Failed to submit property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-background-light z-50 overflow-y-auto"
      style={{ paddingTop: '80px', paddingLeft: '64px' }}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </button>

          <div className="text-sm text-text-muted">
            Step {currentStep + 1} of {steps.length}
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
              />
            </form>
          </FormProvider>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-text-primary">Submitting property...</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AddProperty;