// ============ CLIENT/SRC/PAGES/MYPROPERTIES.JSX ============
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';

const MyProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if user can access this page
  if (!user || (user.userType !== 'landlord' && user.userType !== 'both')) {
    return (
      <div className="error-container">
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚫</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1f2937' }}>
            Access Denied
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '25px' }}>
            Only landlords can access property management. Please update your account type in your profile.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getMyProperties(filter);
      
      if (response.success) {
        setProperties(response.data.properties);
        setStats(response.data.stats);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;

    try {
      const response = await propertyService.deleteProperty(selectedProperty._id);
      
      if (response.success) {
        setProperties(properties.filter(p => p._id !== selectedProperty._id));
        setShowDeleteModal(false);
        setSelectedProperty(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to delete property');
      console.error('Error deleting property:', err);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    if (filter === 'active') return property.isActive;
    if (filter === 'inactive') return !property.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header - Full Width */}
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                My Properties
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Manage your property listings and track performance
              </p>
            </div>
            <Link
              to="/add-property"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ➕ Add New Property
            </Link>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                backgroundColor: '#eff6ff',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe'
              }}>
                <h3 style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '5px' }}>
                  {stats.totalProperties}
                </h3>
                <p style={{ color: '#1e40af', fontWeight: '500' }}>Total Properties</p>
              </div>
              <div style={{
                backgroundColor: '#f0fdf4',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #bbf7d0'
              }}>
                <h3 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '5px' }}>
                  {stats.activeProperties}
                </h3>
                <p style={{ color: '#166534', fontWeight: '500' }}>Active Listings</p>
              </div>
              <div style={{
                backgroundColor: '#fefbeb',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #fed7aa'
              }}>
                <h3 style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '5px' }}>
                  {stats.totalViews}
                </h3>
                <p style={{ color: '#92400e', fontWeight: '500' }}>Total Views</p>
              </div>
              <div style={{
                backgroundColor: '#faf5ff',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #d8b4fe'
              }}>
                <h3 style={{ fontSize: '1.5rem', color: '#8b5cf6', marginBottom: '5px' }}>
                  NPR {Math.round(stats.averageRent || 0).toLocaleString()}
                </h3>
                <p style={{ color: '#7c3aed', fontWeight: '500' }}>Average Rent</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
            {[
              { key: 'all', label: 'All Properties', count: properties.length },
              { key: 'active', label: 'Active', count: properties.filter(p => p.isActive).length },
              { key: 'inactive', label: 'Inactive', count: properties.filter(p => !p.isActive).length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: filter === tab.key ? '#2563eb' : 'white',
                  color: filter === tab.key ? 'white' : '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '25px'
          }}>
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={property} 
                onDelete={(prop) => {
                  setSelectedProperty(prop);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏠</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#1f2937' }}>
              {filter === 'all' ? 'No properties yet' : `No ${filter} properties`}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              {filter === 'all' 
                ? 'Start by adding your first property listing'
                : `You don't have any ${filter} properties at the moment`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/add-property"
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Add Your First Property
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProperty && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#1f2937' }}>
              Delete Property
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Are you sure you want to delete "<strong>{selectedProperty.title}</strong>"? 
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProperty(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb'
    }}>
      {/* Property Image */}
      <div style={{ height: '200px', backgroundColor: '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
        {property.images && property.images.length > 0 && !imageError ? (
          <img
            src={property.images[0]}
            alt={property.title}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: '3rem'
          }}>
            🏠
          </div>
        )}
        
        {/* Status Badge */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          backgroundColor: property.isActive ? '#10b981' : '#dc2626',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          {property.isActive ? 'Active' : 'Inactive'}
        </div>

        {/* Views Badge */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          👁️ {property.views || 0} views
        </div>
      </div>

      {/* Property Details */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#1f2937',
            lineHeight: '1.4'
          }}>
            {property.title}
          </h3>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            📍 {property.address.city}, {property.address.state}
          </p>
        </div>

        {/* Property Features */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '15px',
          fontSize: '0.85rem',
          color: '#6b7280'
        }}>
          <span>🛏️ {property.totalRooms} rooms</span>
          <span>🚿 {property.bathrooms} bath</span>
          <span>✅ {property.availableRooms} available</span>
        </div>

        {/* Price and Date */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ 
            fontSize: '1.3rem', 
            fontWeight: 'bold', 
            color: '#10b981',
            marginBottom: '5px'
          }}>
            NPR {property.rent.toLocaleString()}/month
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            Listed on {new Date(property.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '15px'
        }}>
          <Link
            to={`/properties/${property._id}`}
            style={{
              flex: '1',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '10px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              textAlign: 'center'
            }}
          >
            View Details
          </Link>
          <Link
            to={`/properties/${property._id}/edit`}
            style={{
              flex: '1',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '10px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              textAlign: 'center'
            }}
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(property)}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '10px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProperties;