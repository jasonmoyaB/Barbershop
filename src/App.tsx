import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AdminLayout from './features/admin/AdminLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminBookings from './features/admin/AdminBookings';
import AdminRegister from './features/admin/AdminRegister';
import AdminClients from './features/admin/AdminClients';
import AdminHours from './features/admin/AdminHours';
import ProtectedRoute from './features/admin/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="hours" element={<AdminHours />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
