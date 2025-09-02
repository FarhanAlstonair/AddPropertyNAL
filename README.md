# Real Estate Property Management Dashboard

A modern, scalable React + TypeScript dashboard for managing real estate properties with clean UI/UX design.

## 🚀 Features

- **Property Management**: Add, view, edit, and delete properties
- **Advanced Filtering**: Filter by status, listing intent, city, and search
- **Multi-step Forms**: Comprehensive property addition with validation
- **Media Upload**: Image and video upload with preview
- **Responsive Design**: Mobile-first approach with smooth animations
- **Draft Saving**: Auto-save form drafts to localStorage
- **Clean UI**: Professional design following strict color theme

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **State Management**: Context API
- **Animations**: Framer Motion
- **Build Tool**: Create React App

## 🎨 Design System

### Color Theme
- **Primary**: #2B256D (deep purple-blue)
- **Background**: #FFFFFF and #F9FAFB
- **Text**: #111827, #374151, #6B7280
- **Active State**: #2B256D

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── form/           # Form step components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Navbar.tsx      # Top navigation
│   ├── PropertyCard.tsx # Property display card
│   └── ...
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main property listing
│   ├── PropertyDetails.tsx # Property detail view
│   └── AddProperty.tsx # Property form
├── layouts/            # Layout components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces
├── utils/              # Utility functions and API
└── assets/             # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Backend Integration Points

The application is designed with clear separation for easy backend integration:

### API Functions (src/utils/api.ts)
Replace mock functions with actual API calls:

```typescript
// Current: Mock implementation
export const api = {
  fetchProperties: async (): Promise<Property[]> => {
    // Replace with: return await fetch('/api/properties').then(res => res.json())
    await delay(500);
    return mockProperties;
  },
  
  createProperty: async (data: PropertyFormData): Promise<Property> => {
    // Replace with: return await fetch('/api/properties', { method: 'POST', body: formData })
    // Handle file uploads to your storage service
  },
  
  // ... other API functions
};
```

### Database Schema
Recommended MySQL/PostgreSQL schema:

```sql
CREATE TABLE properties (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('apartment', 'house', 'villa', 'commercial'),
  bhk VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  area INT,
  price DECIMAL(15,2),
  listing_intent ENUM('sale', 'rent'),
  status ENUM('active', 'sold', 'rented') DEFAULT 'active',
  description TEXT,
  amenities JSON,
  images JSON,
  videos JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### File Upload Integration
For image/video uploads, integrate with:
- **AWS S3** for cloud storage
- **Cloudinary** for image optimization
- **Local storage** for development

Example integration:
```typescript
const uploadFiles = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json(); // Returns array of file URLs
};
```

## 📱 Features Overview

### Dashboard
- Property grid with filtering
- Empty state for new users
- Responsive design with mobile support

### Property Details
- Full-page overlay with image carousel
- Comprehensive property information
- Video player support
- Contact and scheduling actions

### Add Property Form
- 6-step wizard: Details → Documents → Intent → Location → Media → Review
- Real-time validation with React Hook Form
- File upload with preview
- Draft auto-saving
- Form submission with loading states

### Responsive Behavior
- **Desktop**: Full sidebar with property grid
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu with back navigation

## 🔄 State Management

Uses React Context API for global state:
- Property list management
- Filter state
- Selected property
- Loading states

Easy to migrate to Redux when needed:
```typescript
// Current Context structure ready for Redux migration
interface AppContextType {
  properties: Property[];
  filters: PropertyFilters;
  selectedProperty: Property | null;
  // ... actions
}
```

## 🎯 Next Steps for Production

1. **Backend Integration**
   - Replace mock API calls
   - Implement authentication
   - Add user management

2. **Enhanced Features**
   - Property analytics
   - Advanced search with maps
   - Bulk operations
   - Export functionality

3. **Performance Optimization**
   - Image lazy loading
   - Virtual scrolling for large lists
   - Code splitting

4. **Testing**
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Cypress

## 📄 License

This project is created for demonstration purposes. Modify as needed for your use case.