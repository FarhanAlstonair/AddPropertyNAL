import { Property, PropertyFormData } from '../types';
import { mockProperties } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions - Replace with actual backend calls
export const api = {
  // Fetch all properties
  fetchProperties: async (): Promise<Property[]> => {
    await delay(500);
    return mockProperties;
  },

  // Fetch single property by ID
  fetchPropertyById: async (id: string): Promise<Property | null> => {
    await delay(300);
    return mockProperties.find(p => p.id === id) || null;
  },

  // Create new property
  createProperty: async (data: PropertyFormData): Promise<Property> => {
    await delay(800);
    
    // Convert File arrays to string arrays
    const imageCategories: { [key: string]: string[] } = {};
    Object.entries(data.imageCategories || {}).forEach(([category, files]) => {
      imageCategories[category] = files.map(file => URL.createObjectURL(file));
    });
    
    const newProperty: Property = {
      id: Date.now().toString(),
      ...data,
      images: data.images.map(file => URL.createObjectURL(file)),
      videos: data.videos?.map(file => URL.createObjectURL(file)) || [],
      imageCategories,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newProperty;
  },

  // Update existing property
  updateProperty: async (id: string, data: Partial<Property>): Promise<Property> => {
    await delay(600);
    const existing = mockProperties.find(p => p.id === id);
    if (!existing) throw new Error('Property not found');
    
    return {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString()
    };
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await delay(400);
    // In real implementation, make DELETE request to backend
    console.log(`Deleting property ${id}`);
  },

  // Save draft to localStorage
  saveDraft: (data: Partial<PropertyFormData>): void => {
    localStorage.setItem('propertyDraft', JSON.stringify(data));
  },

  // Load draft from localStorage
  loadDraft: (): Partial<PropertyFormData> | null => {
    const draft = localStorage.getItem('propertyDraft');
    return draft ? JSON.parse(draft) : null;
  },

  // Clear draft
  clearDraft: (): void => {
    localStorage.removeItem('propertyDraft');
  }
};