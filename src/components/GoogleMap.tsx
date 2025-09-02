import React from 'react';

interface GoogleMapProps {
  coordinates?: { lat: number; lng: number };
  address?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ coordinates, address, className = "w-full h-64" }) => {
  // Default to India center if no coordinates provided
  const defaultCoords = { lat: 20.5937, lng: 78.9629 };
  const mapCoords = coordinates || defaultCoords;
  
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${mapCoords.lat},${mapCoords.lng}&zoom=${coordinates ? 15 : 5}`;
  
  return (
    <div className={`${className} bg-gray-100 border border-gray-300 rounded-lg overflow-hidden`}>
      {/* Placeholder for Google Maps - Replace with actual Google Maps API */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
        <div className="text-center p-6">
          <svg className="mx-auto w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="font-medium text-blue-900 mb-1">
            {coordinates ? 'Property Location' : 'India Map View'}
          </div>
          <div className="text-sm text-blue-700">
            {address || 'Interactive map will be displayed here'}
          </div>
          <div className="text-xs text-blue-600 mt-2">
            Google Maps integration ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;