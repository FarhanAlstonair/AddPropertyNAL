import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ImageCarousel from '../components/ImageCarousel';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, selectedProperty, setSelectedProperty } = useApp();

  useEffect(() => {
    if (id) {
      const property = properties.find(p => p.id === id);
      if (property) {
        setSelectedProperty(property);
      } else {
        navigate('/');
      }
    }
  }, [id, properties, setSelectedProperty, navigate]);

  if (!selectedProperty) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatPrice = (price: number, intent: string) => {
    if (intent === 'rent') {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${(price / 100000).toFixed(1)} Lakhs`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-background-light z-50 overflow-y-auto"
      style={{ paddingTop: '80px', paddingLeft: '64px' }}
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </button>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              Edit Property
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <ImageCarousel images={selectedProperty.images} title={selectedProperty.title} />

            {/* Property Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {selectedProperty.title}
                  </h1>
                  <div className="flex items-center text-text-muted">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedProperty.address}, {selectedProperty.city}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProperty.status)}`}>
                  {selectedProperty.status.charAt(0).toUpperCase() + selectedProperty.status.slice(1)}
                </span>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-background-light rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedProperty.bhk}</div>
                  <div className="text-sm text-text-muted">Configuration</div>
                </div>
                <div className="text-center p-4 bg-background-light rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedProperty.area}</div>
                  <div className="text-sm text-text-muted">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-background-light rounded-lg">
                  <div className="text-2xl font-bold text-primary capitalize">{selectedProperty.type}</div>
                  <div className="text-sm text-text-muted">Property Type</div>
                </div>
                <div className="text-center p-4 bg-background-light rounded-lg">
                  <div className="text-2xl font-bold text-primary capitalize">{selectedProperty.listingIntent}</div>
                  <div className="text-sm text-text-muted">Listing Type</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Description</h3>
                <p className="text-text-secondary leading-relaxed">
                  {selectedProperty.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {selectedProperty.amenities.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedProperty.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-text-secondary">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Video */}
            {selectedProperty.videos && selectedProperty.videos.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Property Video Tour</h3>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={selectedProperty.videos[0]}
                    poster={selectedProperty.images[0]}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-3 text-sm text-text-muted">
                  Take a virtual tour of this property
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Location</h3>
              <div className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                  <div className="text-center p-6">
                    <svg className="mx-auto w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="font-medium text-blue-900 mb-1">
                      {selectedProperty.coordinates ? 'Property Location' : 'India Map View'}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedProperty.address}
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      Google Maps integration ready
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary mb-2">
                  {formatPrice(selectedProperty.price, selectedProperty.listingIntent)}
                </div>
                <div className="text-text-muted">
                  {selectedProperty.listingIntent === 'rent' ? 'Monthly Rent' : selectedProperty.listingIntent === 'urgent-sale' ? 'Urgent Sale Price' : 'Total Price'}
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium">
                  Contact Owner
                </button>
                <button className="w-full border border-primary text-primary py-3 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
                  Schedule Visit
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-text-muted space-y-2">
                  <div className="flex justify-between">
                    <span>Listed on:</span>
                    <span>{new Date(selectedProperty.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last updated:</span>
                    <span>{new Date(selectedProperty.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {selectedProperty.biddingEnabled && (
                    <div className="flex justify-between">
                      <span>Bidding:</span>
                      <span className="text-green-600 font-medium">Enabled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;