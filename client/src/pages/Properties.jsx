// ============ CLIENT/SRC/PAGES/PROPERTIES.JSX (FULL-SCREEN) ============
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import propertyService from '../services/propertyService';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    amenities: searchParams.get('amenities') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const page = searchParams.get('page') || 1;
      const queryParams = { ...filters, page, limit: 12 };
      
      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const response = await propertyService.getProperties(queryParams);
      
      if (response.success) {
        setProperties(response.data.properties);
        setPagination(response.data.pagination);
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

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await propertyService.getPropertyStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) newSearchParams.set(k, newFilters[k]);
    });
    setSearchParams(newSearchParams);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  // Handle pagination
  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page);
    setSearchParams(newSearchParams);
  };

  if (loading && !properties.length) {
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
          <p style={{ color: '#6b7280' }}>Loading properties...</p>
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
      {/* Header Section - Full Width */}
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
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '15px',
              margin: '0 0 15px 0'
            }}>
              Find Your Perfect Room
            </h1>
            <p style={{ 
              color: '#6b7280', 
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
              maxWidth: '600px', 
              margin: '0 auto'
            }}>
              Browse through {pagination?.totalProperties || 0} available properties and find your ideal living space
            </p>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                backgroundColor: '#eff6ff', 
                borderRadius: '12px',
                border: '1px solid #bfdbfe',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                  color: '#2563eb', 
                  marginBottom: '5px',
                  margin: '0 0 5px 0'
                }}>
                  {stats.general.totalProperties || 0}
                </h3>
                <p style={{ color: '#1e40af', margin: 0 }}>Total Properties</p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                  color: '#10b981', 
                  marginBottom: '5px',
                  margin: '0 0 5px 0'
                }}>
                  {stats.general.totalAvailableRooms || 0}
                </h3>
                <p style={{ color: '#166534', margin: 0 }}>Available Rooms</p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                backgroundColor: '#fefbeb', 
                borderRadius: '12px',
                border: '1px solid #fed7aa',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', 
                  color: '#f59e0b', 
                  marginBottom: '5px',
                  margin: '0 0 5px 0'
                }}>
                  NPR {Math.round(stats.general.averageRent || 0).toLocaleString()}
                </h3>
                <p style={{ color: '#92400e', margin: 0 }}>Average Rent</p>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #e5e7eb' 
          }}>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                alignItems: 'center', 
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  placeholder="Search properties, locations..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={{
                    flex: '1',
                    minWidth: '300px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="studio">Studio</option>
                  <option value="room">Room</option>
                </select>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Advanced Filters */}
            {showFilters && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontSize: '0.9rem', 
                    color: '#374151' 
                  }}>
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontSize: '0.9rem', 
                    color: '#374151' 
                  }}>
                    Min Rent (NPR)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minRent}
                    onChange={(e) => handleFilterChange('minRent', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontSize: '0.9rem', 
                    color: '#374151' 
                  }}>
                    Max Rent (NPR)
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={filters.maxRent}
                    onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontSize: '0.9rem', 
                    color: '#374151' 
                  }}>
                    Min Bathrooms
                  </label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontSize: '0.9rem', 
                    color: '#374151' 
                  }}>
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="rent">Price: Low to High</option>
                    <option value="views">Most Popular</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section - Full Width */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '40px 20px',
        width: '100%'
      }}>
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

        {/* Results Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: 0
          }}>
            {pagination ? `${pagination.totalProperties} Properties Found` : 'Properties'}
          </h2>
          {pagination && pagination.totalProperties > 0 && (
            <p style={{ color: '#6b7280', margin: 0 }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
          )}
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : !loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏠</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '10px', 
              color: '#1f2937',
              margin: '0 0 10px 0'
            }}>
              No properties found
            </h3>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>
              Try adjusting your search criteria or browse all properties
            </p>
            <button
              onClick={() => {
                setFilters({
                  search: '', city: '', propertyType: '', minRent: '', maxRent: '',
                  bathrooms: '', amenities: '', sortBy: 'createdAt', sortOrder: 'desc'
                });
                setSearchParams({});
              }}
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
              Clear Filters
            </button>
          </div>
        ) : null}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              style={{
                padding: '10px 15px',
                backgroundColor: pagination.hasPrev ? '#2563eb' : '#d1d5db',
                color: pagination.hasPrev ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '6px',
                cursor: pagination.hasPrev ? 'pointer' : 'not-allowed'
              }}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = Math.max(1, pagination.currentPage - 2) + i;
              if (page > pagination.totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: page === pagination.currentPage ? '#2563eb' : 'white',
                    color: page === pagination.currentPage ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              style={{
                padding: '10px 15px',
                backgroundColor: pagination.hasNext ? '#2563eb' : '#d1d5db',
                color: pagination.hasNext ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '6px',
                cursor: pagination.hasNext ? 'pointer' : 'not-allowed'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/properties/${property._id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        height: '100%'
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: '1px solid #e5e7eb'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
      >
        {/* Property Image */}
        <div style={{ 
          height: '220px', 
          backgroundColor: '#e5e7eb', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
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

          {/* Available Rooms Badge */}
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            {property.availableRooms} available
          </div>
        </div>

        {/* Property Details */}
        <div style={{ 
          padding: '25px', 
          flex: '1', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <h3 style={{ 
            fontSize: '1.3rem', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            color: '#1f2937',
            lineHeight: '1.4',
            margin: '0 0 10px 0'
          }}>
            {property.title}
          </h3>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '15px',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            margin: '0 0 15px 0'
          }}>
            📍 {property.address.city}, {property.address.state}
          </p>

          <div style={{ marginBottom: '15px', flex: '1' }}>
            <p style={{ 
              color: '#4b5563', 
              fontSize: '0.9rem',
              lineHeight: '1.5',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              margin: 0
            }}>
              {property.description}
            </p>
          </div>

          {/* Property Features */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            fontSize: '0.85rem',
            color: '#6b7280',
            margin: '0 0 20px 0'
          }}>
            <span>🛏️ {property.totalRooms} rooms</span>
            <span>🚿 {property.bathrooms} bath</span>
            {property.totalArea && <span>📏 {property.totalArea} sq ft</span>}
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div style={{ marginBottom: '20px', margin: '0 0 20px 0' }}>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px'
              }}>
                {property.amenities.slice(0, 3).map((amenity) => (
                  <span key={amenity} style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize'
                  }}>
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span style={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    padding: '3px 8px'
                  }}>
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price and Action */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px'
          }}>
            <div>
              <p style={{ 
                fontSize: '1.4rem', 
                fontWeight: 'bold', 
                color: '#10b981',
                marginBottom: '2px',
                margin: '0 0 2px 0'
              }}>
                NPR {property.rent.toLocaleString()}
              </p>
              <p style={{ 
                fontSize: '0.8rem', 
                color: '#6b7280',
                margin: 0
              }}>
                per month
              </p>
            </div>
            <div style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              View Details
            </div>
          </div>

          {/* Landlord Info */}
          {property.landlord && (
            <div style={{ 
              marginTop: '15px',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              fontSize: '0.85rem',
              margin: '15px 0 0 0'
            }}>
              <p style={{ 
                color: '#374151', 
                marginBottom: '3px',
                margin: '0 0 3px 0'
              }}>
                Listed by: <strong>{property.landlord.firstName} {property.landlord.lastName}</strong>
              </p>
              {property.landlord.averageRating > 0 && (
                <p style={{ color: '#6b7280', margin: 0 }}>
                  ⭐ {property.landlord.averageRating.toFixed(1)} ({property.landlord.totalReviews} reviews)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Properties;