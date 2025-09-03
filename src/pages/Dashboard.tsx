import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import EmptyState from '../components/EmptyState';
import { Property } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { properties, filters, setFilters, setSelectedProperty } = useApp();

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property: Property) => {
      const matchesStatus = filters.status === 'all' || property.status === filters.status;
      const matchesIntent = filters.listingIntent === 'all' || property.listingIntent === filters.listingIntent;
      const matchesCity = !filters.city || property.city === filters.city;
      const matchesSearch = !filters.search || 
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.city.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesIntent && matchesCity && matchesSearch;
    });
  }, [properties, filters]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    navigate(`/property/${property.id}`);
  };

  const handleViewBids = (property: Property) => {
    navigate(`/bidding/${property.id}`);
  };

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  // Show empty state if no properties exist at all
  if (properties.length === 0) {
    return <EmptyState onAddProperty={handleAddProperty} />;
  }

  return (
    <div className="p-6">
      {/* Header with Filters and Add Property Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Properties ({filteredProperties.length})
          </h2>
          <p className="text-text-muted mt-1">
            Manage your property listings
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <PropertyFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
          <button
            onClick={handleAddProperty}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium whitespace-nowrap"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={handlePropertyClick}
                onBidNow={handleViewBids}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto w-16 h-16 text-text-muted mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No properties found
            </h3>
            <p className="text-text-muted mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => setFilters({
                status: 'all',
                listingIntent: 'all',
                city: '',
                search: ''
              })}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;