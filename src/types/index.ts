// Property Types
export interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'villa' | 'commercial';
  bhk: string;
  address: string;
  city: string;
  area: number;
  price: number;
  listingIntent: 'rent' | 'sale' | 'urgent-sale';
  status: 'active' | 'sold' | 'rented';
  amenities: string[];
  images: string[];
  videos?: string[];
  description: string;
  biddingEnabled?: boolean;
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

// Form Types
export interface PropertyFormData {
  title: string;
  type: Property['type'];
  bhk: string;
  address: string;
  city: string;
  area: number;
  price: number;
  listingIntent: 'rent' | 'sale' | 'urgent-sale';
  amenities: string[];
  description: string;
  images: File[];
  videos: File[];
  documents: File[];
  requiredDocuments: File[];
  biddingEnabled: boolean;
  coordinates?: { lat: number; lng: number };
}

// Filter Types
export interface PropertyFilters {
  status: Property['status'] | 'all';
  listingIntent: Property['listingIntent'] | 'all';
  city: string;
  search: string;
}

// Context Types
export interface AppContextType {
  properties: Property[];
  filters: PropertyFilters;
  isLoading: boolean;
  selectedProperty: Property | null;
  setProperties: (properties: Property[]) => void;
  setFilters: (filters: PropertyFilters) => void;
  setSelectedProperty: (property: Property | null) => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
}

// Form Step Types
export type FormStep = 'details' | 'documents' | 'intent' | 'location' | 'media' | 'review';

export interface FormStepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}