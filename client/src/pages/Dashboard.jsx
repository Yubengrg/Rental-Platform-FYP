import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';

const Dashboard = () => {
  const { user } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.userType === 'landlord' || user?.userType === 'both') {
          const response = await propertyService.getMyProperties();
          if (response.success) {
            setMyProperties(response.data.properties);
            setStats(response.data.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 70px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            {user?.userType === 'tenant' && "Ready to find your perfect room?"}
            {user?.userType === 'landlord' && "Manage your properties and find great tenants"}
            {user?.userType === 'both' && "Manage your properties or find a new place to live"}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Quick Actions */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <Link 
              to="/properties" 
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏠</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                Browse Properties
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Find your perfect room or apartment
              </p>
            </Link>

            {(user?.userType === 'landlord' || user?.userType === 'both') && (
              <Link 
                to="/add-property" 
                style={{
                  backgroundColor: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>➕</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  Add Property
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  List a new property for rent
                </p>
              </Link>
            )}

            <Link 
              to="/profile" 
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>👤</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                Update Profile
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Complete your profile for better matches
              </p>
            </Link>
          </div>
        </div>

        {/* Landlord Stats */}
        {(user?.userType === 'landlord' || user?.userType === 'both') && stats && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
              Your Statistics
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '10px' }}>
                  {stats.totalProperties}
                </h3>
                <p style={{ color: '#6b7280' }}>Total Properties</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '10px' }}>
                  {stats.activeProperties}
                </h3>
                <p style={{ color: '#6b7280' }}>Active Properties</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '10px' }}>
                  {stats.totalViews}
                </h3>
                <p style={{ color: '#6b7280' }}>Total Views</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '10px' }}>
                  NPR {Math.round(stats.averageRent || 0).toLocaleString()}
                </h3>
                <p style={{ color: '#6b7280' }}>Average Rent</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Properties */}
        {(user?.userType === 'landlord' || user?.userType === 'both') && myProperties.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>
                Your Recent Properties
              </h2>
              <Link 
                to="/my-properties"
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                View All →
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {myProperties.slice(0, 3).map((property) => (
                <div 
                  key={property._id} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    height: '150px',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem'
                  }}>
                    🏠
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 'bold' }}>
                      {property.title}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '0.9rem' }}>
                      📍 {property.address.city}, {property.address.state}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                        NPR {property.rent.toLocaleString()}/month
                      </span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        backgroundColor: property.isActive ? '#dcfce7' : '#fee2e2',
                        color: property.isActive ? '#166534' : '#dc2626'
                      }}>
                        {property.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Tenants or Users with No Properties */}
        {((user?.userType === 'tenant') || 
          ((user?.userType === 'landlord' || user?.userType === 'both') && myProperties.length === 0)) && (
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏠</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
              {user?.userType === 'tenant' 
                ? "Ready to find your perfect room?" 
                : "Ready to list your first property?"
              }
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
              {user?.userType === 'tenant' 
                ? "Browse through hundreds of available properties and find compatible roommates." 
                : "Start earning by listing your property and connecting with great tenants."
              }
            </p>
            <Link 
              to={user?.userType === 'tenant' ? '/properties' : '/add-property'}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {user?.userType === 'tenant' ? 'Browse Properties' : 'Add First Property'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;