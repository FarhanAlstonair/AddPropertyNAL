import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import BiddingManagement from './pages/BiddingManagement';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/bidding/:id" element={<BiddingManagement />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;