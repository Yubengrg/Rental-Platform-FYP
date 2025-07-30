// ============ FIXED: SERVER/MODELS/USER.JS ============
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Added missing import

const userSchema = new mongoose.Schema({
  // Basic Info
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: { 
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  
  // Profile
  profilePicture: { type: String },
  bio: { 
    type: String, 
    maxLength: [500, 'Bio cannot exceed 500 characters']
  },
  occupation: { type: String },
  university: { type: String },
  
  // Lifestyle Preferences
  lifestyle: {
    sleepSchedule: { 
      type: String, 
      enum: ['early', 'normal', 'late'],
      default: 'normal'
    },
    cleanliness: { 
      type: Number, 
      min: [1, 'Cleanliness rating must be between 1-5'], 
      max: [5, 'Cleanliness rating must be between 1-5'],
      default: 3
    },
    socialLevel: { 
      type: Number, 
      min: [1, 'Social level must be between 1-5'], 
      max: [5, 'Social level must be between 1-5'],
      default: 3
    },
    noiseTolerance: { 
      type: Number, 
      min: [1, 'Noise tolerance must be between 1-5'], 
      max: [5, 'Noise tolerance must be between 1-5'],
      default: 3
    },
    petsAllowed: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    guestsPolicy: { 
      type: String, 
      enum: ['never', 'occasionally', 'frequently'],
      default: 'occasionally'
    }
  },
  
  // Verification
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isIdentityVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  
  // Password Reset
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  
  // Account
  userType: { 
    type: String, 
    enum: ['tenant', 'landlord', 'both'], 
    default: 'tenant' 
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  
  // Ratings
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ isActive: 1 });
userSchema.index({ userType: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash the password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);