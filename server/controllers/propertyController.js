const Property = require('../models/Property');
const User = require('../models/User');
const ApiResponse = require('../utils/response');

class PropertyController {
  // @desc    Create a new property
  // @route   POST /api/properties
  // @access  Private (Landlord only)
  static async createProperty(req, res) {
    try {
      const {
        title,
        description,
        address,
        propertyType,
        totalRooms,
        availableRooms,
        bathrooms,
        totalArea,
        rent,
        deposit,
        utilities,
        amenities,
        rules,
        images,
        virtualTourUrl,
        availableFrom,
        leaseDuration
      } = req.body;

      // Check if user is landlord or both
      if (!['landlord', 'both'].includes(req.user.userType)) {
        return ApiResponse.forbidden(res, 'Only landlords can create properties');
      }

      // Create new property
      const property = new Property({
        title,
        description,
        address,
        propertyType,
        totalRooms,
        availableRooms,
        bathrooms,
        totalArea,
        rent,
        deposit,
        utilities,
        amenities,
        rules,
        images,
        virtualTourUrl,
        availableFrom,
        leaseDuration,
        landlord: req.user._id
      });

      await property.save();

      // Populate landlord info
      await property.populate('landlord', 'firstName lastName email phone averageRating totalReviews');

      return ApiResponse.success(res, { property }, 'Property created successfully', 201);

    } catch (error) {
      console.error('Create property error:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return ApiResponse.error(res, messages.join(', '), 400);
      }

      return ApiResponse.error(res, 'Server error while creating property');
    }
  }

  // @desc    Get all properties with filters and pagination
  // @route   GET /api/properties
  // @access  Public
  static async getAllProperties(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        city,
        propertyType,
        minRent,
        maxRent,
        bathrooms,
        amenities,
        availableRooms,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search
      } = req.query;

      // Build filter object
      const filter = { isActive: true, availableRooms: { $gt: 0 } };

      if (city) {
        filter['address.city'] = { $regex: city, $options: 'i' };
      }

      if (propertyType) {
        filter.propertyType = propertyType;
      }

      if (minRent || maxRent) {
        filter.rent = {};
        if (minRent) filter.rent.$gte = Number(minRent);
        if (maxRent) filter.rent.$lte = Number(maxRent);
      }

      if (bathrooms) {
        filter.bathrooms = { $gte: Number(bathrooms) };
      }

      if (availableRooms) {
        filter.availableRooms = { $gte: Number(availableRooms) };
      }

      if (amenities) {
        const amenitiesList = amenities.split(',');
        filter.amenities = { $in: amenitiesList };
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'address.street': { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);

      // Execute query
      const properties = await Property.find(filter)
        .populate('landlord', 'firstName lastName email phone averageRating totalReviews profilePicture')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      // Get total count for pagination
      const total = await Property.countDocuments(filter);
      const totalPages = Math.ceil(total / Number(limit));

      return ApiResponse.success(res, {
        properties,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProperties: total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }, 'Properties retrieved successfully');

    } catch (error) {
      console.error('Get properties error:', error);
      return ApiResponse.error(res, 'Server error while fetching properties');
    }
  }

  // @desc    Get single property by ID
  // @route   GET /api/properties/:id
  // @access  Public
  static async getPropertyById(req, res) {
    try {
      const property = await Property.findById(req.params.id)
        .populate('landlord', 'firstName lastName email phone averageRating totalReviews profilePicture bio');

      if (!property || !property.isActive) {
        return ApiResponse.notFound(res, 'Property not found');
      }

      // Increment view count
      property.views += 1;
      await property.save();

      return ApiResponse.success(res, { property }, 'Property retrieved successfully');

    } catch (error) {
      console.error('Get property by ID error:', error);
      return ApiResponse.error(res, 'Server error while fetching property');
    }
  }

  // @desc    Update property
  // @route   PUT /api/properties/:id
  // @access  Private (Property owner only)
  static async updateProperty(req, res) {
    try {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return ApiResponse.notFound(res, 'Property not found');
      }

      // Check if user owns the property
      if (property.landlord.toString() !== req.user._id.toString()) {
        return ApiResponse.forbidden(res, 'You can only update your own properties');
      }

      const allowedUpdates = [
        'title', 'description', 'address', 'propertyType', 'totalRooms',
        'availableRooms', 'bathrooms', 'totalArea', 'rent', 'deposit',
        'utilities', 'amenities', 'rules', 'images', 'virtualTourUrl',
        'availableFrom', 'leaseDuration', 'isActive'
      ];

      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return ApiResponse.error(res, 'Invalid updates', 400);
      }

      updates.forEach(update => {
        if (update === 'address' && req.body.address) {
          property.address = { ...property.address.toObject(), ...req.body.address };
        } else if (update === 'utilities' && req.body.utilities) {
          property.utilities = { ...property.utilities.toObject(), ...req.body.utilities };
        } else if (update === 'rules' && req.body.rules) {
          property.rules = { ...property.rules.toObject(), ...req.body.rules };
        } else {
          property[update] = req.body[update];
        }
      });

      await property.save();
      await property.populate('landlord', 'firstName lastName email phone averageRating totalReviews');

      return ApiResponse.success(res, { property }, 'Property updated successfully');

    } catch (error) {
      console.error('Update property error:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return ApiResponse.error(res, messages.join(', '), 400);
      }

      return ApiResponse.error(res, 'Server error while updating property');
    }
  }

  // @desc    Delete property
  // @route   DELETE /api/properties/:id
  // @access  Private (Property owner only)
  static async deleteProperty(req, res) {
    try {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return ApiResponse.notFound(res, 'Property not found');
      }

      // Check if user owns the property
      if (property.landlord.toString() !== req.user._id.toString()) {
        return ApiResponse.forbidden(res, 'You can only delete your own properties');
      }

      await Property.findByIdAndDelete(req.params.id);

      return ApiResponse.success(res, null, 'Property deleted successfully');

    } catch (error) {
      console.error('Delete property error:', error);
      return ApiResponse.error(res, 'Server error while deleting property');
    }
  }

  // @desc    Get properties by landlord
  // @route   GET /api/properties/landlord/:landlordId
  // @access  Public
  static async getPropertiesByLandlord(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const properties = await Property.find({
        landlord: req.params.landlordId,
        isActive: true
      })
        .populate('landlord', 'firstName lastName email averageRating totalReviews')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Property.countDocuments({
        landlord: req.params.landlordId,
        isActive: true
      });

      const totalPages = Math.ceil(total / Number(limit));

      return ApiResponse.success(res, {
        properties,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProperties: total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }, 'Landlord properties retrieved successfully');

    } catch (error) {
      console.error('Get landlord properties error:', error);
      return ApiResponse.error(res, 'Server error while fetching landlord properties');
    }
  }

  // @desc    Get my properties (for current user)
  // @route   GET /api/properties/my-properties
  // @access  Private (Landlord only)
  static async getMyProperties(req, res) {
    try {
      const { page = 1, limit = 10, status = 'all' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build filter
      const filter = { landlord: req.user._id };
      
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      }

      const properties = await Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Property.countDocuments(filter);
      const totalPages = Math.ceil(total / Number(limit));

      // Get summary stats
      const stats = await Property.aggregate([
        { $match: { landlord: req.user._id } },
        {
          $group: {
            _id: null,
            totalProperties: { $sum: 1 },
            activeProperties: { $sum: { $cond: ['$isActive', 1, 0] } },
            totalViews: { $sum: '$views' },
            averageRent: { $avg: '$rent' }
          }
        }
      ]);

      return ApiResponse.success(res, {
        properties,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProperties: total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        },
        stats: stats[0] || {
          totalProperties: 0,
          activeProperties: 0,
          totalViews: 0,
          averageRent: 0
        }
      }, 'Your properties retrieved successfully');

    } catch (error) {
      console.error('Get my properties error:', error);
      return ApiResponse.error(res, 'Server error while fetching your properties');
    }
  }

  // @desc    Search properties with advanced filters
  // @route   POST /api/properties/search
  // @access  Public
  static async searchProperties(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {},
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.body;

      // Build MongoDB aggregation pipeline
      const pipeline = [];

      // Match stage
      const matchFilter = { isActive: true, availableRooms: { $gt: 0 } };

      if (filters.location) {
        const { city, state, coordinates, radius } = filters.location;
        
        if (coordinates && radius) {
          // Geospatial search
          matchFilter['address.coordinates'] = {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [coordinates.lng, coordinates.lat]
              },
              $maxDistance: radius * 1000 // Convert km to meters
            }
          };
        } else {
          if (city) matchFilter['address.city'] = { $regex: city, $options: 'i' };
          if (state) matchFilter['address.state'] = { $regex: state, $options: 'i' };
        }
      }

      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        matchFilter.rent = {};
        if (min) matchFilter.rent.$gte = Number(min);
        if (max) matchFilter.rent.$lte = Number(max);
      }

      if (filters.propertyType) {
        matchFilter.propertyType = { $in: filters.propertyType };
      }

      if (filters.amenities && filters.amenities.length > 0) {
        matchFilter.amenities = { $in: filters.amenities };
      }

      if (filters.rooms) {
        if (filters.rooms.min) matchFilter.totalRooms = { $gte: Number(filters.rooms.min) };
        if (filters.rooms.max) {
          matchFilter.totalRooms = { 
            ...matchFilter.totalRooms, 
            $lte: Number(filters.rooms.max) 
          };
        }
      }

      if (filters.bathrooms) {
        matchFilter.bathrooms = { $gte: Number(filters.bathrooms) };
      }

      pipeline.push({ $match: matchFilter });

      // Lookup landlord information
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'landlord',
          foreignField: '_id',
          as: 'landlord',
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                phone: 1,
                averageRating: 1,
                totalReviews: 1,
                profilePicture: 1
              }
            }
          ]
        }
      });

      pipeline.push({
        $unwind: '$landlord'
      });

      // Sort stage
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      pipeline.push({ $sort: sort });

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: Number(limit) });

      // Execute aggregation
      const properties = await Property.aggregate(pipeline);

      // Get total count
      const countPipeline = [
        { $match: matchFilter },
        { $count: 'total' }
      ];
      const countResult = await Property.aggregate(countPipeline);
      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / Number(limit));

      return ApiResponse.success(res, {
        properties,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProperties: total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        },
        appliedFilters: filters
      }, 'Properties search completed successfully');

    } catch (error) {
      console.error('Search properties error:', error);
      return ApiResponse.error(res, 'Server error while searching properties');
    }
  }

  // @desc    Get property statistics
  // @route   GET /api/properties/stats
  // @access  Public
  static async getPropertyStats(req, res) {
    try {
      const stats = await Property.aggregate([
        {
          $match: { isActive: true }
        },
        {
          $group: {
            _id: null,
            totalProperties: { $sum: 1 },
            averageRent: { $avg: '$rent' },
            minRent: { $min: '$rent' },
            maxRent: { $max: '$rent' },
            totalAvailableRooms: { $sum: '$availableRooms' }
          }
        }
      ]);

      const propertyTypeStats = await Property.aggregate([
        {
          $match: { isActive: true }
        },
        {
          $group: {
            _id: '$propertyType',
            count: { $sum: 1 },
            averageRent: { $avg: '$rent' }
          }
        }
      ]);

      const cityStats = await Property.aggregate([
        {
          $match: { isActive: true }
        },
        {
          $group: {
            _id: '$address.city',
            count: { $sum: 1 },
            averageRent: { $avg: '$rent' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      return ApiResponse.success(res, {
        general: stats[0] || {},
        byPropertyType: propertyTypeStats,
        byCity: cityStats
      }, 'Property statistics retrieved successfully');

    } catch (error) {
      console.error('Get property stats error:', error);
      return ApiResponse.error(res, 'Server error while fetching property statistics');
    }
  }
}

module.exports = PropertyController;