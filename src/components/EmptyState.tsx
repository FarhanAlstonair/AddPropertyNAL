import React from 'react';

interface EmptyStateProps {
  onAddProperty: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddProperty }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-lg mx-auto">
        {/* Icon Container */}
        <div className="mb-12">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-16 h-16 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary/10 rounded-full"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-4 tracking-tight">
              No Properties Yet
            </h2>
            <p className="text-lg text-text-muted leading-relaxed max-w-md mx-auto">
              Get started by adding your first property to the system.
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={onAddProperty}
              className="group inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Property
            </button>
          </div>
          
          {/* Helper text */}
          <p className="text-sm text-text-muted/80 mt-6">
            Start building your property portfolio today
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;