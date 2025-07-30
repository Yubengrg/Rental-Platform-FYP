const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test each route file one by one
console.log('Testing auth routes...');
app.use('/api/auth', require('./routes/authRoutes'));

console.log('Testing user routes...');
app.use('/api/users', require('./routes/userRoutes'));

console.log('Testing property routes...');
app.use('/api/properties', require('./routes/propertyRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 5001; // Different port for testing

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Test server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });