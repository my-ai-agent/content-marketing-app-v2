// AI Business Suite Backend - Main Server
// Supports: Content Marketing + 4 future AI tools

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const NodeCache = require('node-cache');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Session cache - 24 hour storage
const sessionCache = new NodeCache({ stdTTL: 86400 }); // 24 hours

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://content-marketing-app-v2.vercel.app',
    // Add your other domains here
  ]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import route modules (we'll create these next)
// const contentRoutes = require('./routes/content');
// const sessionRoutes = require('./routes/session');
// const userRoutes = require('./routes/users');

// Routes (uncomment when we add route files)
// app.use('/api/content', contentRoutes);
// app.use('/api/session', sessionRoutes);
// app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI Business Suite Backend',
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'AI Business Suite Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/test'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Business Suite Backend running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Export cache for use in routes
module.exports = { sessionCache };
