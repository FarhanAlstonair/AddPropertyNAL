import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
  onBidNow?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, onBidNow }) => {
  const formatPrice = (price: number, intent: string) => {
    if (intent === 'rent') {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'rent': return 'bg-blue-100 text-blue-800';
      case 'sale': return 'bg-green-100 text-green-800';
      case 'urgent-sale': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };





  const getStatusText = () => {
    if (property.biddingEnabled && property.status === 'active') {
      return 'Bidding';
    }
    switch (property.status) {
      case 'active':
        return property.listingIntent === 'urgent-sale' ? 'Urgent Sale' : 'Active';
      case 'sold': return 'Sold';
      case 'rented': return 'Rented';
      default: return 'Inactive';
    }
  };

  const getStatusTextColor = () => {
    if (property.biddingEnabled && property.status === 'active') {
      return 'text-purple-600';
    }
    switch (property.status) {
      case 'active':
        return property.listingIntent === 'urgent-sale' ? 'text-red-600' : 'text-green-600';
      case 'sold': return 'text-blue-600';
      case 'rented': return 'text-indigo-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        


        {/* Image Count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
            +{property.images.length - 1} more
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-text-primary text-lg truncate">{property.title}</h3>
          <span className="text-primary font-bold text-lg ml-2">
            {formatPrice(property.price, property.listingIntent)}
          </span>
        </div>

        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center text-text-muted text-sm mb-2">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{property.address}, {property.city}</span>
          </div>
          
          {/* Status Tags */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(property.status)}`}>
              {getStatusText()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntentColor(property.listingIntent)}`}>
              {property.listingIntent === 'urgent-sale' ? 'Urgent Sale' : property.listingIntent.charAt(0).toUpperCase() + property.listingIntent.slice(1)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-text-muted">
                <span className="font-medium text-text-primary">{property.bhk}</span>
              </span>
              <span className="text-text-muted">
                <span className="font-medium text-text-primary">{property.area}</span> sq ft
              </span>
              <span className="text-text-muted">
                <span className="font-medium text-text-primary capitalize">{property.type}</span>
              </span>
            </div>
          </div>

          {/* Amenities Preview */}
          {property.amenities.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 4).map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded font-medium"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-text-muted text-xs rounded">
                    +{property.amenities.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(property);
              }}
              className="flex-1 px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
            >
              View Details
            </button>
            {property.biddingEnabled && (property.listingIntent === 'sale' || property.listingIntent === 'urgent-sale') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onBidNow) {
                    onBidNow(property);
                  } else {
                    // Navigate to bidding page directly
                    window.location.href = `/bidding/${property.id}`;
                  }
                }}
                className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                {property.status === 'active' ? 'Manage Bids' : 'View Bids'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;