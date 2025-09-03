import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ImageCarousel from '../components/ImageCarousel';
import GoogleMap from '../components/GoogleMap';
import { formatIndianPrice } from '../utils/priceFormatter';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, selectedProperty, setSelectedProperty, deleteProperty } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      style={{ paddingTop: '80px', paddingLeft: window.innerWidth < 768 ? '0px' : '72px' }}
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
            <button 
              onClick={() => navigate(`/edit-property/${id}`)}
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Edit Property
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                <div className="text-center p-4 bg-background-light rounded-lg">
                  <div className="text-2xl font-bold text-primary capitalize">{selectedProperty.sellerType || 'Owner'}</div>
                  <div className="text-sm text-text-muted">Seller Type</div>
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
            {(selectedProperty.amenities.length > 0 || (selectedProperty.customAmenities && selectedProperty.customAmenities.length > 0)) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Amenities</h3>
                <div className="space-y-4">
                  {selectedProperty.amenities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-3">Standard Amenities</h4>
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
                  {selectedProperty.customAmenities && selectedProperty.customAmenities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-3">Custom Amenities</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedProperty.customAmenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-text-secondary">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Virtual Tour */}
            {selectedProperty.virtualTour && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">360° Virtual Tour</h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <a 
                    href={selectedProperty.virtualTour} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-primary hover:text-primary-dark transition-colors"
                  >
                    <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-lg font-medium">View 360° Tour</span>
                  </a>
                </div>
              </div>
            )}

            {/* Categorized Image Gallery */}
            {selectedProperty.imageCategories && Object.keys(selectedProperty.imageCategories).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Image Gallery by Category</h3>
                <div className="space-y-6">
                  {Object.entries(selectedProperty.imageCategories).map(([category, images]) => (
                    images.length > 0 && (
                      <div key={category}>
                        <h4 className="font-medium text-text-secondary mb-3">{category} ({images.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {images.slice(0, 4).map((image, index) => (
                            <div key={index} className="relative group cursor-pointer">
                              <img
                                src={image}
                                alt={`${category} ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                            </div>
                          ))}
                          {images.length > 4 && (
                            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-text-muted text-sm">+{images.length - 4} more</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
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
          <div className="lg:col-span-2 lg:pl-6">
            {/* Google Maps - Premium Container */}
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
              <GoogleMap 
                address={selectedProperty.address}
                coordinates={selectedProperty.coordinates || { lat: 20.5937, lng: 78.9629 }} // Default to India center
                height="450px"
                zoom={selectedProperty.coordinates ? 15 : 5}
              />
              
              <div className="p-6 bg-white">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {formatIndianPrice(selectedProperty.price, selectedProperty.listingIntent)}
                  </div>
                  <div className="text-text-muted">
                    {selectedProperty.listingIntent === 'rent' ? 'Monthly Rent' : selectedProperty.listingIntent === 'urgent-sale' ? 'Urgent Sale Price' : 'Sale Price'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      const coords = selectedProperty.coordinates;
                      const url = coords 
                        ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
                        : `https://www.google.com/maps/search/${encodeURIComponent(selectedProperty.address + ', ' + selectedProperty.city)}`;
                      window.open(url, '_blank');
                    }}
                    className="w-full px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    View Location on Google Maps
                  </button>
                  {selectedProperty.biddingEnabled && (
                    <button 
                      onClick={() => navigate(`/bidding/${selectedProperty.id}`)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Manage Bids
                    </button>
                  )}
                </div>

                {/* Property Insights */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-text-primary mb-3">Property Insights</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-background-light rounded-lg">
                      <div className="text-xl font-bold text-primary">{selectedProperty.views || 0}</div>
                      <div className="text-xs text-text-muted">Views</div>
                    </div>
                    <div className="p-3 bg-background-light rounded-lg">
                      <div className="text-xl font-bold text-primary">{selectedProperty.inquiries || 0}</div>
                      <div className="text-xs text-text-muted">Inquiries</div>
                    </div>
                  </div>
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
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium capitalize ${
                        selectedProperty.status === 'active' ? 'text-green-600' :
                        selectedProperty.status === 'sold' ? 'text-blue-600' :
                        selectedProperty.status === 'rented' ? 'text-purple-600' :
                        'text-gray-600'
                      }`}>
                        {selectedProperty.status}
                      </span>
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary">Delete Property</h3>
              </div>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      deleteProperty(selectedProperty.id);
                      navigate('/');
                    } catch (error) {
                      console.error('Failed to delete property:', error);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyDetails;