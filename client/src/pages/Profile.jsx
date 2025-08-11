// ============ CLIENT/SRC/PAGES/PROFILE.JSX ============
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    occupation: '',
    university: ''
  });

  const [lifestyleData, setLifestyleData] = useState({
    sleepSchedule: 'normal',
    cleanliness: 3,
    socialLevel: 3,
    noiseTolerance: 3,
    petsAllowed: false,
    smokingAllowed: false,
    guestsPolicy: 'occasionally'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    if (user) {
      setPersonalData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        bio: user.bio || '',
        occupation: user.occupation || '',
        university: user.university || ''
      });

      setLifestyleData({
        sleepSchedule: user.lifestyle?.sleepSchedule || 'normal',
        cleanliness: user.lifestyle?.cleanliness || 3,
        socialLevel: user.lifestyle?.socialLevel || 3,
        noiseTolerance: user.lifestyle?.noiseTolerance || 3,
        petsAllowed: user.lifestyle?.petsAllowed || false,
        smokingAllowed: user.lifestyle?.smokingAllowed || false,
        guestsPolicy: user.lifestyle?.guestsPolicy || 'occasionally'
      });

      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userService.updateProfile(personalData);
      
      if (response.success) {
        showMessage('success', 'Personal information updated successfully!');
      } else {
        showMessage('error', response.message || 'Failed to update profile');
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLifestyleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userService.updateProfile({ lifestyle: lifestyleData });
      
      if (response.success) {
        showMessage('success', 'Lifestyle preferences updated successfully!');
      } else {
        showMessage('error', response.message || 'Failed to update preferences');
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'New password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        showMessage('success', 'Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showMessage('error', response.message || 'Failed to change password');
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    
    if (!profilePicture.trim()) {
      showMessage('error', 'Please enter a valid image URL');
      return;
    }

    setLoading(true);

    try {
      const response = await userService.uploadProfilePicture({ profilePicture });
      
      if (response.success) {
        showMessage('success', 'Profile picture updated successfully!');
      } else {
        showMessage('error', response.message || 'Failed to update profile picture');
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🏠' },
    { id: 'picture', label: 'Profile Picture', icon: '📸' },
    { id: 'password', label: 'Password', icon: '🔒' }
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
          padding: '40px 20px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              overflow: 'hidden'
            }}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                {user?.firstName} {user?.lastName}
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '5px' }}>
                {user?.email}
              </p>
              <span style={{
                backgroundColor: user?.userType === 'landlord' ? '#eff6ff' : user?.userType === 'both' ? '#fefbeb' : '#f0fdf4',
                color: user?.userType === 'landlord' ? '#2563eb' : user?.userType === 'both' ? '#f59e0b' : '#10b981',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {user?.userType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        width: '100%'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
          {/* Sidebar Navigation */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '20px',
            height: 'fit-content',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
              Account Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                    color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    width: '100%'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '40px'
          }}>
            {message.text && (
              <div style={{
                backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                color: message.type === 'success' ? '#166534' : '#dc2626',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '30px'
              }}>
                {message.text}
              </div>
            )}

            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' }}>
                  Personal Information
                </h2>
                <form onSubmit={handlePersonalSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        value={personalData.firstName}
                        onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
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
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={personalData.lastName}
                        onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
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
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={personalData.phone}
                        onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                        placeholder="e.g., +977 9800000000"
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
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={personalData.dateOfBirth}
                        onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
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
                        Gender
                      </label>
                      <select
                        value={personalData.gender}
                        onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
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
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={personalData.occupation}
                        onChange={(e) => setPersonalData({ ...personalData, occupation: e.target.value })}
                        placeholder="e.g., Software Engineer"
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
                      University/College
                    </label>
                    <input
                      type="text"
                      value={personalData.university}
                      onChange={(e) => setPersonalData({ ...personalData, university: e.target.value })}
                      placeholder="e.g., Tribhuvan University"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#6b7280' }}>
                      Enter a direct link to your image. Make sure the URL ends with .jpg, .png, or .gif
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#9ca3af' : '#8b5cf6',
                      color: 'white',
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Profile Picture'}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' }}>
                  Change Password
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                  Update your password to keep your account secure. Make sure to use a strong password.
                </p>

                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
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
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ marginTop: '5px', fontSize: '0.85rem', color: '#6b7280' }}>
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
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

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#9ca3af' : '#dc2626',
                      color: 'white',
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;