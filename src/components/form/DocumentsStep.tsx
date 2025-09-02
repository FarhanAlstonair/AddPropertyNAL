import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';

const DocumentsStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { setValue, watch, trigger, formState: { errors } } = useFormContext<PropertyFormData>();
  const [requiredDocuments, setRequiredDocuments] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);

  const requiredDocTypes = [
    'Property ownership documents',
    'Building approvals and permits', 
    'Property tax receipts',
    'NOC certificates',
    'Floor plans or blueprints'
  ];

  const handleRequiredFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = [...requiredDocuments, ...files];
    setRequiredDocuments(newDocs);
    setValue('requiredDocuments', newDocs);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(prev => [...prev, ...files]);
    setValue('documents', [...documents, ...files]);
  };

  const removeRequiredDocument = (index: number) => {
    const newDocs = requiredDocuments.filter((_, i) => i !== index);
    setRequiredDocuments(newDocs);
    setValue('requiredDocuments', newDocs);
  };

  const removeDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
    setValue('documents', newDocuments);
  };

  const handleNext = async () => {
    const isValid = await trigger(['requiredDocuments']);
    if (isValid && requiredDocuments.length >= 3) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Property Documents</h2>
        <p className="text-text-muted">Upload required and additional property documents</p>
      </div>

      <div className="space-y-8">
        {/* Required Documents */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Required Documents *</h3>
          <p className="text-sm text-text-muted mb-4">Upload at least 3 of the following documents (mandatory):</p>
          
          <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleRequiredFileChange}
              className="hidden"
              id="required-documents-upload"
            />
            <label htmlFor="required-documents-upload" className="cursor-pointer">
              <svg className="mx-auto w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-base font-medium text-red-700 mb-1">
                Upload Required Documents
              </div>
              <div className="text-sm text-red-600">
                PDF, DOC, DOCX, JPG, PNG files up to 10MB each
              </div>
            </label>
          </div>

          {requiredDocuments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-text-primary mb-3">Required Documents ({requiredDocuments.length})</h4>
              <div className="space-y-2">
                {requiredDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-text-primary">{file.name}</div>
                        <div className="text-sm text-text-muted">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRequiredDocument(index)}
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

          {requiredDocuments.length < 3 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠ You need to upload at least 3 required documents to proceed. ({requiredDocuments.length}/3)
              </p>
            </div>
          )}

          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Required Document Types:</h4>
            <ul className="text-sm text-red-800 space-y-1">
              {requiredDocTypes.map((docType, index) => (
                <li key={index}>• {docType}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional Documents */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Additional Documents (Optional)</h3>
          
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="documents-upload"
          />
          <label htmlFor="documents-upload" className="cursor-pointer">
            <svg className="mx-auto w-12 h-12 text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-lg font-medium text-text-primary mb-2">
              Click to upload documents
            </div>
            <div className="text-text-muted">
              PDF, DOC, DOCX, JPG, PNG files up to 10MB each
            </div>
          </label>
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-text-primary">Uploaded Documents ({documents.length})</h3>
            <div className="space-y-2">
              {documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background-light rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-text-muted mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div className="font-medium text-text-primary">{file.name}</div>
                      <div className="text-sm text-text-muted">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
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
          disabled={requiredDocuments.length < 3}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Intent
        </button>
      </div>
    </div>
  );
};

export default DocumentsStep;