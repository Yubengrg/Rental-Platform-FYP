// ============ CLIENT/SRC/APP.JSX ============
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            
            {/* Placeholder routes for future pages */}
            <Route
              path="/properties"
              element={
                <div style={{ 
                  minHeight: 'calc(100vh - 70px)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '20px',
                  backgroundColor: '#f8fafc',
                  padding: '40px 20px'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '60px 40px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '500px'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏠</div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '15px', color: '#1f2937' }}>
                      Properties Page
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '25px' }}>
                      Coming soon! This will show all available properties with advanced search and filtering.
                    </p>
                    <div style={{ 
                      backgroundColor: '#eff6ff', 
                      padding: '15px', 
                      borderRadius: '8px',
                      border: '1px solid #bfdbfe'
                    }}>
                      <p style={{ fontSize: '0.9rem', color: '#1e40af', margin: 0 }}>
                        💡 This page will include property listings, search filters, map view, and detailed property information.
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
            
            <Route
              path="/add-property"
              element={
                <PrivateRoute>
                  <div style={{ 
                    minHeight: 'calc(100vh - 70px)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '20px',
                    backgroundColor: '#f8fafc',
                    padding: '40px 20px'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '60px 40px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      textAlign: 'center',
                      maxWidth: '500px'
                    }}>
                      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>➕</div>
                      <h1 style={{ fontSize: '2rem', marginBottom: '15px', color: '#1f2937' }}>
                        Add Property Page
                      </h1>
                      <p style={{ color: '#6b7280', marginBottom: '25px' }}>
                        Coming soon! This will allow landlords to add new properties with photos, descriptions, and amenities.
                      </p>
                      <div style={{ 
                        backgroundColor: '#f0fdf4', 
                        padding: '15px', 
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <p style={{ fontSize: '0.9rem', color: '#166534', margin: 0 }}>
                          💡 This page will include property details form, image upload, pricing settings, and availability management.
                        </p>
                      </div>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <div style={{ 
                    minHeight: 'calc(100vh - 70px)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '20px',
                    backgroundColor: '#f8fafc',
                    padding: '40px 20px'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '60px 40px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      textAlign: 'center',
                      maxWidth: '500px'
                    }}>
                      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
                      <h1 style={{ fontSize: '2rem', marginBottom: '15px', color: '#1f2937' }}>
                        Profile Page
                      </h1>
                      <p style={{ color: '#6b7280', marginBottom: '25px' }}>
                        Coming soon! This will allow users to update their profiles, lifestyle preferences, and account settings.
                      </p>
                      <div style={{ 
                        backgroundColor: '#fefbeb', 
                        padding: '15px', 
                        borderRadius: '8px',
                        border: '1px solid #fed7aa'
                      }}>
                        <p style={{ fontSize: '0.9rem', color: '#92400e', margin: 0 }}>
                          💡 This page will include personal info, lifestyle preferences, verification status, and privacy settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;