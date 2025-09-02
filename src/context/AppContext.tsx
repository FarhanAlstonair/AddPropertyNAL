import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, PropertyFilters, AppContextType } from '../types';
import { api } from '../utils/api';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({
    status: 'all',
    listingIntent: 'all',
    city: '',
    search: ''
  });

  // Load properties on mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProperty: Property = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProperties(prev => [newProperty, ...prev]);
      return newProperty;
    } catch (error) {
      console.error('Failed to add property:', error);
      throw error;
    }
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === id 
          ? { ...property, ...updates, updatedAt: new Date().toISOString() }
          : property
      )
    );
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(property => property.id !== id));
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
  };

  const value: AppContextType = {
    properties,
    filters,
    isLoading,
    selectedProperty,
    setProperties,
    setFilters,
    setSelectedProperty,
    addProperty,
    updateProperty,
    deleteProperty
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};