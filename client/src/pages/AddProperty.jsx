// ============ CLIENT/SRC/PAGES/ADDPROPERTY.JSX ============
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nepal'
    },
    propertyType: 'apartment',
    totalRooms: 1,
    availableRooms: 1,
    bathrooms: 1,
    totalArea: '',
    rent: '',
    deposit: '',
    utilities: {
      included: false,
      cost: 0
    },
    amenities: [],
    rules: {
      petsAllowed: false,
      smokingAllowed: false,
      partiesAllowed: false,
      genderPreference: 'any',
      maxOccupants: ''
    },
    images: [''],
    virtualTourUrl: '',
    availableFrom: '',
    leaseDuration: 'flexible'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Check if user can create properties
  if (!user || (user.userType !== 'landlord' && user.userType !== 'both')) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}>
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
            Only landlords can add properties. Please update your account type in your profile.
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

  const amenityOptions = [
    'wifi', 'parking', 'laundry', 'gym', 'pool', 'ac', 
    'heating', 'furnished', 'kitchen', 'balcony', 'elevator',
    'security', 'garden', 'rooftop'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.propertyType;
      case 2:
        return formData.address.street && formData.address.city && formData.address.state && formData.address.zipCode;
      case 3:
        return formData.totalRooms && formData.bathrooms && formData.rent && formData.deposit && formData.availableFrom;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean up empty images
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        bathrooms: parseInt(formData.bathrooms),
        rent: parseFloat(formData.rent),
        deposit: parseFloat(formData.deposit),
        totalArea: formData.totalArea ? parseFloat(formData.totalArea) : undefined,
        utilities: {
          ...formData.utilities,
          cost: parseFloat(formData.utilities.cost) || 0
        },
        rules: {
          ...formData.rules,
          maxOccupants: formData.rules.maxOccupants ? parseInt(formData.rules.maxOccupants) : undefined
        }
      };

      const response = await propertyService.createProperty(cleanedData);
      
      if (response.success) {
        navigate('/my-properties');
      } else {
        setError(response.message || 'Failed to create property');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    'Basic Information',
    'Location Details', 
    'Property Details',
    'Additional Information'
  ];

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
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '30px 20px',
          width: '100%'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
            Add New Property
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            List your property and connect with potential tenants
          </p>
        </div>
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',
        width: '100%'
      }}>
        {/* Progress Steps */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {stepTitles.map((title, index) => (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: currentStep > index + 1 ? '#10b981' : currentStep === index + 1 ? '#2563eb' : '#e5e7eb',
                  color: currentStep >= index + 1 ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  fontWeight: 'bold'
                }}>
                  {currentStep > index + 1 ? '✓' : index + 1}
                </div>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: currentStep >= index + 1 ? '#1f2937' : '#6b7280',
                  fontWeight: currentStep === index + 1 ? '600' : 'normal'
                }}>
                  {title}
                </p>
              </div>
            ))}
          </div>
          <div style={{ 
            height: '4px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#2563eb',
              width: `${((currentStep - 1) / 3) * 100}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Form */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '25px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' }}>
                  Basic Information
                </h2>
                
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Spacious 2-bedroom apartment in Thamel"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="studio">Studio</option>
                    <option value="room">Room</option>
                  </select>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property, its features, and what makes it special..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' }}>
                  Location Details
                </h2>
                
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    required
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="e.g., 123 Main Street"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      required
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Kathmandu"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      required
                      value={formData.address.state}
                      onChange={handleInputChange}
                      placeholder="e.g., Bagmati"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      required
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="e.g., 44600"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' }}>
                  Property Details
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Total Rooms *
                    </label>
                    <input
                      type="number"
                      name="totalRooms"
                      required
                      min="1"
                      value={formData.totalRooms}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Available Rooms *
                    </label>
                    <input
                      type="number"
                      name="availableRooms"
                      required
                      min="0"
                      max={formData.totalRooms}
                      value={formData.availableRooms}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      required
                      min="1"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Total Area (sq ft)
                    </label>
                    <input
                      type="number"
                      name="totalArea"
                      min="0"
                      value={formData.totalArea}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Monthly Rent (NPR) *
                    </label>
                    <input
                      type="number"
                      name="rent"
                      required
                      min="0"
                      value={formData.rent}
                      onChange={handleInputChange}
                      placeholder="e.g., 25000"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Security Deposit (NPR) *
                    </label>
                    <input
                      type="number"
                      name="deposit"
                      required
                      min="0"
                      value={formData.deposit}
                      onChange={handleInputChange}
                      placeholder="e.g., 50000"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Available From *
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    required
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Lease Duration
                  </label>
                  <select
                    name="leaseDuration"
                    value={formData.leaseDuration}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="flexible">Flexible</option>
                    <option value="monthly">Monthly</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>

                {/* Utilities */}
                <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                    Utilities
                  </h3>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="utilities.included"
                        checked={formData.utilities.included}
                        onChange={handleInputChange}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontWeight: '500', color: '#374151' }}>
                        Utilities included in rent (water, electricity, internet)
                      </span>
                    </label>
                  </div>
                  {!formData.utilities.included && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                        Additional Utilities Cost (NPR/month)
                      </label>
                      <input
                        type="number"
                        name="utilities.cost"
                        min="0"
                        value={formData.utilities.cost}
                        onChange={handleInputChange}
                        placeholder="e.g., 3000"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 4 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' }}>
                  Additional Information
                </h2>
                
                {/* Amenities */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: '500', color: '#374151' }}>
                    Amenities (Select all that apply)
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {amenityOptions.map((amenity) => (
                      <label key={amenity} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        padding: '10px',
                        backgroundColor: formData.amenities.includes(amenity) ? '#eff6ff' : 'white',
                        border: `1px solid ${formData.amenities.includes(amenity) ? '#2563eb' : '#e5e7eb'}`,
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ 
                          textTransform: 'capitalize', 
                          fontSize: '0.9rem',
                          color: formData.amenities.includes(amenity) ? '#2563eb' : '#374151'
                        }}>
                          {amenity.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* House Rules */}
                <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                    House Rules & Preferences
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="rules.petsAllowed"
                        checked={formData.rules.petsAllowed}
                        onChange={handleInputChange}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontWeight: '500', color: '#374151' }}>Pets Allowed</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="rules.smokingAllowed"
                        checked={formData.rules.smokingAllowed}
                        onChange={handleInputChange}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontWeight: '500', color: '#374151' }}>Smoking Allowed</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="rules.partiesAllowed"
                        checked={formData.rules.partiesAllowed}
                        onChange={handleInputChange}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontWeight: '500', color: '#374151' }}>Parties Allowed</span>
                    </label>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                        Gender Preference
                      </label>
                      <select
                        name="rules.genderPreference"
                        value={formData.rules.genderPreference}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="any">Any</option>
                        <option value="male">Male Only</option>
                        <option value="female">Female Only</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                        Max Occupants
                      </label>
                      <input
                        type="number"
                        name="rules.maxOccupants"
                        min="1"
                        value={formData.rules.maxOccupants}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: '500', color: '#374151' }}>
                    Property Images (URLs)
                  </label>
                  {formData.images.map((image, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        style={{
                          flex: '1',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          style={{
                            padding: '12px 16px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    + Add Another Image
                  </button>
                </div>

                {/* Virtual Tour */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Virtual Tour URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="virtualTourUrl"
                    value={formData.virtualTourUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/virtual-tour"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '40px',
              paddingTop: '25px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentStep === 1 ? '#f3f4f6' : '#6b7280',
                  color: currentStep === 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Previous
              </button>

              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Step {currentStep} of 4
              </div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: validateStep(currentStep) ? '#2563eb' : '#f3f4f6',
                    color: validateStep(currentStep) ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: validateStep(currentStep) ? 'pointer' : 'not-allowed',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: loading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Creating...
                    </>
                  ) : (
                    'Create Property'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;