// ============ CLIENT/SRC/COMPONENTS/NAVBAR.JSX (SCROLL HIDE/SHOW) ============
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Scroll state for hide/show navbar
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll for navbar hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setShowUserMenu(false); // Close menus when hiding
        setShowMobileMenu(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  // Close menus when route changes
  useEffect(() => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', public: true },
    { path: '/properties', label: 'Browse Properties', public: true },
    { path: '/dashboard', label: 'Dashboard', private: true },
    { 
      path: '/add-property', 
      label: 'Add Property', 
      private: true, 
      condition: user?.userType === 'landlord' || user?.userType === 'both' 
    },
    { 
      path: '/my-properties', 
      label: 'My Properties', 
      private: true, 
      condition: user?.userType === 'landlord' || user?.userType === 'both' 
    }
  ];

  return (
    <>
      <nav style={{
        backgroundColor: '#2563eb',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: `translateY(${isVisible ? '0' : '-100%'})`,
        transition: 'transform 0.3s ease-in-out',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => {
              setShowUserMenu(false);
              setShowMobileMenu(false);
            }}
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🏠 RoomMatch
          </Link>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '30px'
          }}>
            {/* Navigation Links */}
            <div style={{ 
              display: 'flex', 
              gap: '25px', 
              alignItems: 'center',
              '@media (max-width: 768px)': { display: 'none' }
            }}>
              {navLinks.map((link) => {
                // Show public links always, private links only when authenticated
                if (link.public || (link.private && isAuthenticated)) {
                  // Check additional conditions
                  if (link.condition !== undefined && !link.condition) return null;
                  
                  return (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowMobileMenu(false);
                      }}
                      style={{
                        color: isActive(link.path) ? '#fbbf24' : 'white',
                        textDecoration: 'none',
                        fontWeight: isActive(link.path) ? '600' : '500',
                        fontSize: '0.95rem',
                        transition: 'color 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive(link.path)) {
                          e.target.style.color = '#e5e7eb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(link.path)) {
                          e.target.style.color = 'white';
                        }
                      }}
                    >
                      {link.label}
                      {isActive(link.path) && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-8px',
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: '#fbbf24',
                          borderRadius: '1px'
                        }} />
                      )}
                    </Link>
                  );
                }
                return null;
              })}
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    overflow: 'hidden'
                  }}>
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.firstName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      user?.firstName?.charAt(0)?.toUpperCase() || '👤'
                    )}
                  </div>
                  <span style={{ 
                    fontWeight: '500',
                    '@media (max-width: 768px)': { display: 'none' }
                  }}>
                    {user?.firstName}
                  </span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    opacity: 0.8,
                    '@media (max-width: 768px)': { display: 'none' }
                  }}>
                    {showUserMenu ? '▲' : '▼'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    minWidth: '200px',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>
                        {user?.email}
                      </p>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        backgroundColor: user?.userType === 'landlord' ? '#eff6ff' : user?.userType === 'both' ? '#fefbeb' : '#f0fdf4',
                        color: user?.userType === 'landlord' ? '#2563eb' : user?.userType === 'both' ? '#f59e0b' : '#10b981',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {user?.userType}
                      </span>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      👤 Profile Settings
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      📊 Dashboard
                    </Link>
                    
                    <div style={{ borderTop: '1px solid #e5e7eb' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                alignItems: 'center',
                '@media (max-width: 768px)': { display: 'none' }
              }}>
                <Link 
                  to="/login" 
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  style={{
                    backgroundColor: 'white',
                    color: '#2563eb',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                display: 'none',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '8px',
                '@media (max-width: 768px)': { display: 'block' }
              }}
            >
              {showMobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div style={{
            backgroundColor: '#1d4ed8',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 999
          }}>
            <div style={{ padding: '20px' }}>
              {navLinks.map((link) => {
                if (link.public || (link.private && isAuthenticated)) {
                  if (link.condition !== undefined && !link.condition) return null;
                  
                  return (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      onClick={() => setShowMobileMenu(false)}
                      style={{
                        display: 'block',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '1rem'
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setShowMobileMenu(false)}
                    style={{
                      display: 'block',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '1rem'
                    }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      marginTop: '15px'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  <Link 
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    style={{
                      display: 'block',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px',
                      textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      marginBottom: '10px'
                    }}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                    style={{
                      display: 'block',
                      backgroundColor: 'white',
                      color: '#2563eb',
                      textDecoration: 'none',
                      padding: '12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay to close menus when clicking outside */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 998
          }}
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: '70px' }} />

      {/* Mobile responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          nav div[style*="gap: '25px'"] {
            display: none !important;
          }
          
          nav div[style*="gap: '15px'"] {
            display: none !important;
          }
          
          nav button[style*="display: 'none'"] {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;