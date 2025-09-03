import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData, FormStepProps } from '../../types';

const DocumentsStep: React.FC<FormStepProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const { setValue, watch, trigger, formState: { errors } } = useFormContext<PropertyFormData>();
  const [requiredDocuments, setRequiredDocuments] = useState<{ file: File; type: string; customType?: string }[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [projectBrochure, setProjectBrochure] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [customDocType, setCustomDocType] = useState('');
  const [uploadError, setUploadError] = useState('');

  const requiredDocTypes = [
    'Property ownership documents',
    'Building approvals and permits', 
    'Property tax receipts',
    'NOC certificates',
    'Floor plans or blueprints',
    'Other (custom)'
  ];

  const handleRequiredFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    
    if (!selectedDocType) {
      setUploadError('Please select a document type first');
      return;
    }
    
    const files = Array.from(e.target.files || []);
    const docType = selectedDocType === 'Other (custom)' ? customDocType : selectedDocType;
    
    if (selectedDocType === 'Other (custom)' && !customDocType.trim()) {
      setUploadError('Please specify the custom document type');
      return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setUploadError(`File size must be under 10MB. ${oversizedFiles[0].name} is too large.`);
      return;
    }
    
    // Check if document type already exists
    const typeExists = requiredDocuments.some(doc => doc.type === docType);
    if (typeExists) {
      setUploadError('This document type has already been uploaded');
      return;
    }
    
    const newDocs = files.map(file => ({
      file,
      type: docType,
      customType: selectedDocType === 'Other (custom)' ? customDocType : undefined
    }));
    
    const updatedDocs = [...requiredDocuments, ...newDocs];
    setRequiredDocuments(updatedDocs);
    setValue('requiredDocuments', updatedDocs);
    
    // Reset selections
    setSelectedDocType('');
    setCustomDocType('');
    e.target.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter(file => file.size <= maxSize);
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setUploadError(`${oversizedFiles.length} file(s) exceed 10MB limit and were skipped.`);
    }
    
    if (validFiles.length > 0) {
      const updatedDocuments = [...documents, ...validFiles];
      setDocuments(updatedDocuments);
      setValue('documents', updatedDocuments);
    }
  };

  const removeRequiredDocument = (index: number) => {
    const newDocs = requiredDocuments.filter((_, i) => i !== index);
    setRequiredDocuments(newDocs);
    setValue('requiredDocuments', newDocs);
    setUploadError(''); // Clear any errors when removing documents
  };

  const getUploadedTypes = () => {
    const types = new Set(requiredDocuments.map(doc => doc.type));
    return Array.from(types);
  };

  const getAvailableDocTypes = () => {
    const uploadedTypes = getUploadedTypes();
    return requiredDocTypes.filter(type => !uploadedTypes.includes(type));
  };

  const hasAllRequiredTypes = () => {
    const uploadedTypes = getUploadedTypes();
    const coreTypes = requiredDocTypes.slice(0, -1); // Exclude 'Other (custom)'
    return coreTypes.filter(type => uploadedTypes.includes(type)).length >= 3;
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setUploadError('Brochure file size must be under 10MB');
        return;
      }
      setProjectBrochure(file);
      setValue('projectBrochure', file);
      setUploadError('');
    }
  };

  const removeBrochure = () => {
    setProjectBrochure(null);
    setValue('projectBrochure', undefined);
  };

  const removeDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
    setValue('documents', newDocuments);
  };

  const handleNext = async () => {
    if (hasAllRequiredTypes() || requiredDocuments.length >= 3) {
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
          
          {/* Document Type Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Select Document Type
              </label>
              <select
                value={selectedDocType}
                onChange={(e) => {
                  setSelectedDocType(e.target.value);
                  setUploadError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Choose document type...</option>
                {getAvailableDocTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Custom Document Type Input */}
            {selectedDocType === 'Other (custom)' && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Specify Document Type
                </label>
                <input
                  type="text"
                  value={customDocType}
                  onChange={(e) => setCustomDocType(e.target.value)}
                  placeholder="Enter document type..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}

            {/* File Upload */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              selectedDocType && (selectedDocType !== 'Other (custom)' || customDocType.trim())
                ? 'border-red-300 hover:border-red-400 cursor-pointer'
                : 'border-gray-200 cursor-not-allowed opacity-50'
            }`}>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleRequiredFileChange}
                className="hidden"
                id="required-documents-upload"
                disabled={!selectedDocType || (selectedDocType === 'Other (custom)' && !customDocType.trim())}
              />
              <label 
                htmlFor="required-documents-upload" 
                className={selectedDocType && (selectedDocType !== 'Other (custom)' || customDocType.trim()) ? 'cursor-pointer' : 'cursor-not-allowed'}
              >
                <svg className="mx-auto w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-base font-medium text-red-700 mb-1">
                  {selectedDocType ? `Upload ${selectedDocType === 'Other (custom)' ? customDocType || 'Custom Document' : selectedDocType}` : 'Select document type first'}
                </div>
                <div className="text-sm text-red-600">
                  PDF, DOC, DOCX, JPG, PNG files up to 10MB each
                </div>
              </label>
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{uploadError}</p>
              </div>
            )}
          </div>

          {requiredDocuments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-text-primary mb-3">Required Documents ({requiredDocuments.length})</h4>
              <div className="space-y-2">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-text-primary">{doc.file.name}</div>
                        <div className="text-sm text-text-muted">
                          {doc.type} • {(doc.file.size / 1024 / 1024).toFixed(2)} MB
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

        {/* Project Brochure */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Project Brochure (Optional)</h3>
          <p className="text-sm text-text-muted mb-4">Upload project brochure or marketing material</p>
          
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleBrochureChange}
              className="hidden"
              id="brochure-upload"
            />
            <label htmlFor="brochure-upload" className="cursor-pointer">
              <svg className="mx-auto w-10 h-10 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-base font-medium text-blue-700 mb-1">
                Upload Project Brochure
              </div>
              <div className="text-sm text-blue-600">
                PDF files up to 10MB
              </div>
            </label>
          </div>

          {projectBrochure && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="font-medium text-text-primary">{projectBrochure.name}</div>
                  <div className="text-sm text-text-muted">
                    {(projectBrochure.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={removeBrochure}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
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
          disabled={!hasAllRequiredTypes() && requiredDocuments.length < 3}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Intent
        </button>
      </div>
    </div>
  );
};

export default DocumentsStep;