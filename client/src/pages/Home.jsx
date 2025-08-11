// ============ CLIENT/SRC/PAGES/HOME.JSX (FULL-SCREEN) ============
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, propertiesResponse] = await Promise.all([
          propertyService.getPropertyStats(),
          propertyService.getProperties({ limit: 6 })
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (propertiesResponse.success) {
          setFeaturedProperties(propertiesResponse.data.properties);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <p style={{ color: '#6b7280' }}>Loading...</p>
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
      {/* Hero Section - Full Width */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        width: '100%',
        margin: 0
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          width: '100%'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            marginBottom: '20px', 
            fontWeight: 'bold',
            margin: '0 0 20px 0'
          }}>
            Find Your Perfect Room
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
            marginBottom: '40px', 
            opacity: 0.9,
            margin: '0 0 40px 0'
          }}>
            Smart matching algorithm connects you with compatible roommates and ideal living spaces
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/properties" 
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Browse Properties
            </Link>
            <Link 
              to="/register" 
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Full Width */}
      {stats && (
        <section style={{ 
          padding: '60px 20px', 
          backgroundColor: 'white',
          width: '100%',
          margin: 0
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            width: '100%'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '40px', 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              color: '#1f2937',
              margin: '0 0 40px 0'
            }}>
              Platform Statistics
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
              width: '100%'
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '30px', 
                backgroundColor: '#eff6ff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                border: '1px solid #bfdbfe'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                  color: '#2563eb', 
                  marginBottom: '10px',
                  margin: '0 0 10px 0'
                }}>
                  {stats.general.totalProperties || 0}
                </h3>
                <p style={{ 
                  color: '#1e40af', 
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: '500',
                  margin: 0
                }}>
                  Total Properties
                </p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '30px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                border: '1px solid #bbf7d0'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                  color: '#10b981', 
                  marginBottom: '10px',
                  margin: '0 0 10px 0'
                }}>
                  {stats.general.totalAvailableRooms || 0}
                </h3>
                <p style={{ 
                  color: '#166534', 
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: '500',
                  margin: 0
                }}>
                  Available Rooms
                </p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '30px', 
                backgroundColor: '#fefbeb', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                border: '1px solid #fed7aa'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                  color: '#f59e0b', 
                  marginBottom: '10px',
                  margin: '0 0 10px 0'
                }}>
                  NPR {Math.round(stats.general.averageRent || 0).toLocaleString()}
                </h3>
                <p style={{ 
                  color: '#92400e', 
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: '500',
                  margin: 0
                }}>
                  Average Rent
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties - Full Width */}
      {featuredProperties.length > 0 && (
        <section style={{ 
          padding: '60px 20px',
          backgroundColor: '#f8fafc',
          width: '100%',
          margin: 0
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            width: '100%'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '40px', 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              color: '#1f2937',
              margin: '0 0 40px 0'
            }}>
              Featured Properties
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              width: '100%'
            }}>
              {featuredProperties.map((property) => (
                <div 
                  key={property._id} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e5e7eb'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    height: '200px',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    position: 'relative'
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
                      width: '100%',
                      height: '100%',
                      fontSize: '3rem'
                    }}>
                      🏠
                    </div>
                    
                    {/* Property Type Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      backgroundColor: 'rgba(37, 99, 235, 0.9)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {property.propertyType}
                    </div>
                  </div>
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ 
                      fontSize: '1.3rem', 
                      marginBottom: '10px', 
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: '0 0 10px 0'
                    }}>
                      {property.title}
                    </h3>
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '15px',
                      fontSize: '0.95rem',
                      margin: '0 0 15px 0'
                    }}>
                      📍 {property.address.city}, {property.address.state}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <div>
                        <p style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: 'bold', 
                          color: '#10b981',
                          margin: '0 0 5px 0'
                        }}>
                          NPR {property.rent.toLocaleString()}/month
                        </p>
                        <p style={{ 
                          fontSize: '0.9rem', 
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {property.totalRooms} rooms • {property.bathrooms} bath
                        </p>
                      </div>
                      <Link 
                        to={`/properties/${property._id}`}
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#1d4ed8';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#2563eb';
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ 
              textAlign: 'center', 
              marginTop: '40px',
              margin: '40px 0 0 0'
            }}>
              <Link 
                to="/properties"
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
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
                View All Properties
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works - Full Width */}
      <section style={{ 
        padding: '60px 20px', 
        backgroundColor: 'white',
        width: '100%',
        margin: 0
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          width: '100%'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '40px', 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: '#1f2937',
            margin: '0 0 40px 0'
          }}>
            How It Works
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            width: '100%'
          }}>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px',
                margin: '0 0 20px 0'
              }}>
                👤
              </div>
              <h3 style={{ 
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', 
                marginBottom: '15px',
                color: '#1f2937',
                margin: '0 0 15px 0'
              }}>
                Create Profile
              </h3>
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Set up your profile with lifestyle preferences and requirements
              </p>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px',
                margin: '0 0 20px 0'
              }}>
                🔍
              </div>
              <h3 style={{ 
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', 
                marginBottom: '15px',
                color: '#1f2937',
                margin: '0 0 15px 0'
              }}>
                Smart Search
              </h3>
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Our algorithm finds properties and roommates that match your criteria
              </p>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px',
                margin: '0 0 20px 0'
              }}>
                🤝
              </div>
              <h3 style={{ 
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', 
                marginBottom: '15px',
                color: '#1f2937',
                margin: '0 0 15px 0'
              }}>
                Connect & Move
              </h3>
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Connect with landlords and compatible roommates, then move in!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;