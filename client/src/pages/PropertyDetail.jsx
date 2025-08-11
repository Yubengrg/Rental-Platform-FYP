// ============ CLIENT/SRC/PAGES/PROPERTYDETAIL.JSX ============
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getProperty(id);
        
        if (response.success) {
          setProperty(response.data.property);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch property details');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
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
          <p style={{ color: '#6b7280' }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#1f2937' }}>
            Property Not Found
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            {error || 'The property you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/properties')}
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
            Browse All Properties
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && property.landlord && property.landlord._id === user._id;

  const amenityIcons = {
    wifi: '📶',
    parking: '🚗',
    laundry: '🧺',
    gym: '💪',
    pool: '🏊',
    ac: '❄️',
    heating: '🔥',
    furnished: '🪑',
    kitchen: '🍳',
    balcony: '🌅',
    elevator: '🛗',
    security: '🔒',
    garden: '🌱',
    rooftop: '🏢'
  };

  const handleContactLandlord = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowContactModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#6b7280' }}>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link to="/properties" style={{ color: '#2563eb', textDecoration: 'none' }}>Properties</Link>
            <span>›</span>
            <span style={{ color: '#1f2937' }}>{property.title}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Left Column - Property Details */}
          <div>
            {/* Image Gallery */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                height: '400px',
                backgroundColor: '#e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '15px'
              }}>
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[currentImageIndex]}
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
                
                {/* Fallback when no image or image fails */}
                <div style={{
                  display: property.images && property.images.length > 0 ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontSize: '4rem'
                }}>
                  🏠
                </div>

                {/* Image Navigation */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                      style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      ›
                    </button>
                    
                    {/* Image Counter */}
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}>
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {property.images && property.images.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  paddingBottom: '10px'
                }}>
                  {property.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        minWidth: '80px',
                        height: '80px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: index === currentImageIndex ? '3px solid #2563eb' : '3px solid transparent'
                      }}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Header */}
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                    {property.title}
                  </h1>
                  <p style={{ fontSize: '1.2rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📍 {property.fullAddress || `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }}>
                    NPR {property.rent.toLocaleString()}
                  </p>
                  <p style={{ color: '#6b7280' }}>per month</p>
                  {property.deposit > 0 && (
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '5px' }}>
                      Deposit: NPR {property.deposit.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Property Features */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛏️</div>
                  <p style={{ fontWeight: '600', color: '#1f2937' }}>{property.totalRooms} Rooms</p>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{property.availableRooms} available</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚿</div>
                  <p style={{ fontWeight: '600', color: '#1f2937' }}>{property.bathrooms} Bathrooms</p>
                </div>
                {property.totalArea && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📏</div>
                    <p style={{ fontWeight: '600', color: '#1f2937' }}>{property.totalArea} sq ft</p>
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏷️</div>
                  <p style={{ fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>{property.propertyType}</p>
                </div>
              </div>

              {/* Availability */}
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <p style={{ color: '#166534', fontSize: '0.95rem' }}>
                  <strong>Available from:</strong> {new Date(property.availableFrom).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {property.leaseDuration && (
                    <span> • <strong>Lease:</strong> {property.leaseDuration}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Description */}
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                Description
              </h2>
              <p style={{ 
                lineHeight: '1.7', 
                color: '#374151', 
                fontSize: '1.1rem',
                whiteSpace: 'pre-line'
              }}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                  Amenities
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  {property.amenities.map((amenity) => (
                    <div key={amenity} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {amenityIcons[amenity] || '✅'}
                      </span>
                      <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                        {amenity.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules & Preferences */}
            {property.rules && (
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                  House Rules & Preferences
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🐕</span>
                    <span>Pets: {property.rules.petsAllowed ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🚭</span>
                    <span>Smoking: {property.rules.smokingAllowed ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎉</span>
                    <span>Parties: {property.rules.partiesAllowed ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                  {property.rules.genderPreference !== 'any' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>👤</span>
                      <span>Preference: {property.rules.genderPreference} only</span>
                    </div>
                  )}
                  {property.rules.maxOccupants && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>👥</span>
                      <span>Max Occupants: {property.rules.maxOccupants}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Utilities */}
            {property.utilities && (
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                  Utilities
                </h2>
                <div style={{
                  padding: '20px',
                  backgroundColor: property.utilities.included ? '#f0fdf4' : '#fefbeb',
                  borderRadius: '8px',
                  border: `1px solid ${property.utilities.included ? '#bbf7d0' : '#fed7aa'}`
                }}>
                  {property.utilities.included ? (
                    <p style={{ color: '#166534', fontSize: '1.1rem' }}>
                      ✅ <strong>Utilities Included</strong> - Water, electricity, and internet are included in rent
                    </p>
                  ) : (
                    <p style={{ color: '#92400e', fontSize: '1.1rem' }}>
                      💰 <strong>Additional Utilities Cost:</strong> NPR {property.utilities.cost?.toLocaleString() || 0}/month
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Landlord Info & Actions */}
          <div style={{ position: 'sticky', top: '20px' }}>
            {/* Landlord Information */}
            {property.landlord && (
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                  Property Owner
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    overflow: 'hidden'
                  }}>
                    {property.landlord.profilePicture ? (
                      <img
                        src={property.landlord.profilePicture}
                        alt={`${property.landlord.firstName} ${property.landlord.lastName}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>
                      {property.landlord.firstName} {property.landlord.lastName}
                    </p>
                    {property.landlord.averageRating > 0 && (
                      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        ⭐ {property.landlord.averageRating.toFixed(1)} ({property.landlord.totalReviews} reviews)
                      </p>
                    )}
                  </div>
                </div>

                {property.landlord.bio && (
                  <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                    {property.landlord.bio}
                  </p>
                )}

                {!isOwner && (
                  <button
                    onClick={handleContactLandlord}
                    style={{
                      width: '100%',
                      padding: '15px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}
                  >
                    Contact Landlord
                  </button>
                )}

                {isOwner && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link
                      to={`/properties/${property._id}/edit`}
                      style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'block'
                      }}
                    >
                      Edit Property
                    </Link>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
                      You own this property
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Property Stats */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
                Property Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Views:</span>
                  <span style={{ fontWeight: '600' }}>{property.views || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Listed:</span>
                  <span style={{ fontWeight: '600' }}>
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Property ID:</span>
                  <span style={{ fontWeight: '600', fontSize: '0.8rem' }}>
                    {property._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => window.navigator.share ? 
                    window.navigator.share({
                      title: property.title,
                      text: property.description,
                      url: window.location.href
                    }) : 
                    navigator.clipboard.writeText(window.location.href)
                  }
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  📤 Share Property
                </button>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  🖨️ Print Details
                </button>
                <Link
                  to="/properties"
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    display: 'block'
                  }}
                >
                  ← Back to All Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
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
            padding: '40px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#1f2937' }}>
              Contact Landlord
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#6b7280', marginBottom: '15px' }}>
                Interested in this property? Contact the landlord directly:
              </p>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ fontWeight: '600', marginBottom: '10px' }}>
                  {property.landlord.firstName} {property.landlord.lastName}
                </p>
                {property.landlord.email && (
                  <p style={{ marginBottom: '8px' }}>
                    📧 <a href={`mailto:${property.landlord.email}`} style={{ color: '#2563eb' }}>
                      {property.landlord.email}
                    </a>
                  </p>
                )}
                {property.landlord.phone && (
                  <p style={{ marginBottom: '8px' }}>
                    📞 <a href={`tel:${property.landlord.phone}`} style={{ color: '#2563eb' }}>
                      {property.landlord.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowContactModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              {property.landlord.email && (
                <a
                  href={`mailto:${property.landlord.email}?subject=Inquiry about ${property.title}&body=Hi ${property.landlord.firstName}, I'm interested in your property "${property.title}" listed for NPR ${property.rent.toLocaleString()}/month. Could you please provide more details?`}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;