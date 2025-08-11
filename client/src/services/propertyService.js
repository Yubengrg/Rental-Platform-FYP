import api from './api';

const propertyService = {
  // Get all properties with filters
  getProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await api.get(`/properties?${queryParams}`);
    return response.data;
  },

  // Get single property
  getProperty: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create property (landlord only)
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get my properties
  getMyProperties: async (status = 'all') => {
    const response = await api.get(`/properties/my-properties?status=${status}`);
    return response.data;
  },

  // Search properties
  searchProperties: async (searchData) => {
    const response = await api.post('/properties/search', searchData);
    return response.data;
  },

  // Get property stats
  getPropertyStats: async () => {
    const response = await api.get('/properties/stats');
    return response.data;
  }
};

export default propertyService;