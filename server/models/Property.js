const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Property title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Property description is required'],
    maxLength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Location
  address: {
    street: { type: String, required: [true, 'Street address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    state: { type: String, required: [true, 'State is required'] },
    zipCode: { type: String, required: [true, 'Zip code is required'] },
    country: { type: String, required: [true, 'Country is required'], default: 'Nepal' },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // Property Details
  propertyType: { 
    type: String, 
    enum: {
      values: ['apartment', 'house', 'condo', 'studio', 'room'],
      message: 'Property type must be apartment, house, condo, studio, or room'
    },
    required: [true, 'Property type is required']
  },
  totalRooms: { 
    type: Number, 
    required: [true, 'Total rooms is required'],
    min: [1, 'Total rooms must be at least 1']
  },
  availableRooms: { 
    type: Number, 
    required: [true, 'Available rooms is required'],
    min: [0, 'Available rooms cannot be negative']
  },
  bathrooms: { 
    type: Number, 
    required: [true, 'Number of bathrooms is required'],
    min: [1, 'Bathrooms must be at least 1']
  },
  totalArea: { type: Number }, // in sq ft
  
  // Pricing
  rent: { 
    type: Number, 
    required: [true, 'Rent amount is required'],
    min: [0, 'Rent cannot be negative']
  },
  deposit: { 
    type: Number, 
    required: [true, 'Deposit amount is required'],
    min: [0, 'Deposit cannot be negative']
  },
  utilities: {
    included: { type: Boolean, default: false },
    cost: { type: Number, default: 0, min: [0, 'Utility cost cannot be negative'] }
  },
  
  // Amenities
  amenities: [{
    type: String,
    enum: [
      'wifi', 'parking', 'laundry', 'gym', 'pool', 'ac', 
      'heating', 'furnished', 'kitchen', 'balcony', 'elevator',
      'security', 'garden', 'rooftop'
    ]
  }],
  
  // Rules & Preferences
  rules: {
    petsAllowed: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    partiesAllowed: { type: Boolean, default: false },
    genderPreference: { 
      type: String, 
      enum: ['any', 'male', 'female'],
      default: 'any'
    },
    maxOccupants: { type: Number, min: 1 }
  },
  
  // Media
  images: [{ 
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  }],
  virtualTourUrl: { type: String },
  
  // Landlord
  landlord: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Landlord is required']
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  availableFrom: { 
    type: Date, 
    required: [true, 'Available from date is required']
  },
  leaseDuration: { 
    type: String, 
    enum: ['monthly', '6months', '1year', 'flexible'],
    default: 'flexible'
  },
  
  // Stats
  views: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
propertySchema.index({ landlord: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ 'address.city': 1 });
propertySchema.index({ rent: 1 });
propertySchema.index({ availableFrom: 1 });

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Pre-save middleware
propertySchema.pre('save', function(next) {
  // Ensure available rooms doesn't exceed total rooms
  if (this.availableRooms > this.totalRooms) {
    this.availableRooms = this.totalRooms;
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);