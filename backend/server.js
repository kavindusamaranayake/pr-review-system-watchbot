// Load environment variables (only needed in development, Vercel injects them in production)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const webhookRoutes = require('./src/routes/webhook');
const reviewRoutes = require('./src/routes/reviewRoutes');
const gradingRoutes = require('./routes/gradingRoutes');
const githubRoutes = require('./routes/githubRoutes');
const notionRoutes = require('./routes/notionRoutes');

// CORS Configuration for Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // For Vercel, allow all origins in production (adjust as needed)
    }
  },
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GitHub PR Review Tool API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/grade', gradingRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/notion', notionRoutes);

// Start server only in development mode
// In production (Vercel), the app is exported as a serverless function
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/github`);
  });
}

// Export for Vercel serverless deployment
module.exports = app;
