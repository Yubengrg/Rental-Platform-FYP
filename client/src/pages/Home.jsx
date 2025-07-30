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
        minHeight: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Find Your Perfect Room
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9 }}>
            Smart matching algorithm connects you with compatible roommates and ideal living spaces
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/properties" 
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem'
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
                fontSize: '1.1rem'
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>
              Platform Statistics
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '2.5rem', color: '#2563eb', marginBottom: '10px' }}>
                  {stats.general.totalProperties || 0}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Total Properties</p>
              </div>
              <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '10px' }}>
                  {stats.general.totalAvailableRooms || 0}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Available Rooms</p>
              </div>
              <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '2.5rem', color: '#f59e0b', marginBottom: '10px' }}>
                  NPR {Math.round(stats.general.averageRent || 0).toLocaleString()}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Average Rent</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>
              Featured Properties
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px'
            }}>
              {featuredProperties.map((property) => (
                <div 
                  key={property._id} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <div style={{
                    height: '200px',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                  }}>
                    🏠
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', fontWeight: 'bold' }}>
                      {property.title}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '15px' }}>
                      📍 {property.address.city}, {property.address.state}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                          NPR {property.rent.toLocaleString()}/month
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                          {property.totalRooms} rooms • {property.bathrooms} bath
                        </p>
                      </div>
                      <Link 
                        to={`/properties/${property._id}`}
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link 
                to="/properties"
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
                View All Properties
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>
            How It Works
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Create Profile</h3>
              <p style={{ color: '#6b7280' }}>
                Set up your profile with lifestyle preferences and requirements
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Smart Search</h3>
              <p style={{ color: '#6b7280' }}>
                Our algorithm finds properties and roommates that match your criteria
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤝</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Connect & Move</h3>
              <p style={{ color: '#6b7280' }}>
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