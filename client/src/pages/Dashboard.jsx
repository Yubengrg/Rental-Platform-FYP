// ============ CLIENT/SRC/PAGES/DASHBOARD.JSX (FIXED - FULL SCREEN) ============
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
        minHeight: '100vh',
        width: '100vw',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        margin: 0,
        padding: 0
      }}>
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
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f8fafc',
      margin: 0,
      padding: 0
    }}>
      {/* Header - Full Width */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        width: '100%',
        margin: 0
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '40px 20px',
          width: '100%'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '10px',
            margin: '0 0 10px 0'
          }}>
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            margin: 0
          }}>
            {user?.userType === 'tenant' && "Ready to find your perfect room?"}
            {user?.userType === 'landlord' && "Manage your properties and find great tenants"}
            {user?.userType === 'both' && "Manage your properties or find a new place to live"}
          </p>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '40px 20px',
        width: '100%'
      }}>
        {/* Quick Actions - Full Width */}
        <div style={{ marginBottom: '40px', width: '100%' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: '#1f2937',
            margin: '0 0 20px 0'
          }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            width: '100%'
          }}>
            <Link 
              to="/properties" 
              style={{
                backgroundColor: 'white',
                padding: '30px 25px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb',
                display: 'block',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏠</div>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                Browse Properties
              </h3>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.9rem',
                margin: 0
              }}>
                Find your perfect room or apartment
              </p>
            </Link>

            {(user?.userType === 'landlord' || user?.userType === 'both') && (
              <Link 
                to="/add-property" 
                style={{
                  backgroundColor: 'white',
                  padding: '30px 25px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb',
                  display: 'block',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>➕</div>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  Add Property
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  List a new property for rent
                </p>
              </Link>
            )}

            <Link 
              to="/profile" 
              style={{
                backgroundColor: 'white',
                padding: '30px 25px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb',
                display: 'block',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>👤</div>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                Update Profile
              </h3>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.9rem',
                margin: 0
              }}>
                Complete your profile for better matches
              </p>
            </Link>
          </div>
        </div>

        {/* Landlord Stats - Full Width */}
        {(user?.userType === 'landlord' || user?.userType === 'both') && stats && (
          <div style={{ marginBottom: '40px', width: '100%' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', 
              fontWeight: 'bold', 
              marginBottom: '20px', 
              color: '#1f2937',
              margin: '0 0 20px 0'
            }}>
              Your Statistics
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              width: '100%'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '30px 25px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: '2.5rem', 
                  color: '#2563eb', 
                  marginBottom: '10px',
                  margin: '0 0 10px 0'
                }}>
                  {stats.totalProperties}
                </h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Total Properties</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '30px 25px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: '2.5rem', 
                  color: '#10b981', 
                  marginBottom: '10px',
                  margin: '0 0 10px 0'
                }}>
                  {stats.activeProperties}
                </h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Active Properties</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '30px 25px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: '2.5rem', 
                  color: '#f59e0b', 
                  marginBottom: '10px',
                  margin: '0 0 10px 0'
                }}>
                  {stats.totalViews}
                </h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Total Views</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '30px 25px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                  color: '#8b5cf6', 
                  marginBottom: '10px',
                  margin: '0 0 10px 0'
                }}>
                  NPR {Math.round(stats.averageRent || 0).toLocaleString()}
                </h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Average Rent</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Properties - Full Width */}
        {(user?.userType === 'landlord' || user?.userType === 'both') && myProperties.length > 0 && (
          <div style={{ width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: 0
              }}>
                Your Recent Properties
              </h2>
              <Link 
                to="/my-properties"
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                View All →
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px',
              width: '100%'
            }}>
              {myProperties.slice(0, 3).map((property) => (
                <div 
                  key={property._id} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    height: '180px',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{
                      display: property.images && property.images.length > 0 ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontSize: '3rem'
                    }}>
                      🏠
                    </div>
                  </div>
                  <div style={{ padding: '25px', width: '100%', boxSizing: 'border-box' }}>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      marginBottom: '8px', 
                      fontWeight: 'bold',
                      margin: '0 0 8px 0'
                    }}>
                      {property.title}
                    </h3>
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '15px', 
                      fontSize: '0.9rem',
                      margin: '0 0 15px 0'
                    }}>
                      📍 {property.address.city}, {property.address.state}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <span style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold', 
                        color: '#10b981' 
                      }}>
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

        {/* Empty State for Tenants or Users with No Properties - Full Width */}
        {((user?.userType === 'tenant') || 
          ((user?.userType === 'landlord' || user?.userType === 'both') && myProperties.length === 0)) && (
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center',
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏠</div>
            <h3 style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
              fontWeight: 'bold', 
              marginBottom: '15px', 
              color: '#1f2937',
              margin: '0 0 15px 0'
            }}>
              {user?.userType === 'tenant' 
                ? "Ready to find your perfect room?" 
                : "Ready to list your first property?"
              }
            </h3>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '30px', 
              maxWidth: '500px', 
              margin: '0 auto 30px auto',
              lineHeight: '1.6'
            }}>
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
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(0)';
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