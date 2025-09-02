import React from 'react';
import { PropertyFilters as FilterType } from '../types';
import { availableCities } from '../utils/mockData';

interface PropertyFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof FilterType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search properties..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="sold">Sold</option>
        <option value="rented">Rented</option>
      </select>

      {/* Listing Intent Filter */}
      <select
        value={filters.listingIntent}
        onChange={(e) => handleFilterChange('listingIntent', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="all">All Types</option>
        <option value="sale">For Sale</option>
        <option value="rent">For Rent</option>
        <option value="urgent-sale">Urgent Sale</option>
      </select>

      {/* City Filter */}
      <select
        value={filters.city}
        onChange={(e) => handleFilterChange('city', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="">All Cities</option>
        {availableCities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
};

export default PropertyFilters;