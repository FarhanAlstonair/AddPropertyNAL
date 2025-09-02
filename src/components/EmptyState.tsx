import React from 'react';

interface EmptyStateProps {
  onAddProperty: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddProperty }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg
            className="mx-auto w-24 h-24 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No Properties Yet
        </h3>
        
        <p className="text-text-muted mb-8">
          Get started by adding your first property to the system.
        </p>
        
        <button
          onClick={onAddProperty}
          className="inline-flex items-center px-6 py-3 border-2 border-dashed border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Property
        </button>
      </div>
    </div>
  );
};

export default EmptyState;