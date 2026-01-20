const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file');
  process.exit(1);
}

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 requests per 15 minutes
  message: 'Too many login/registration attempts, please try again later.',
});


// 3. Middlewares
// We configure CORS to only trust your frontend URL
app.use(cors({
  origin: 'https://placementflow.vercel.app/', // Specific origin, not wildcard
  credentials: true, // Enable credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json()); // Parses incoming JSON

// 4. Routes
// These point to the route fileapp.use(express.json());

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth')); // Apply stricter limit to auth
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stats', require('./routes/stats'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Self-ping to keep alive
const keepAliveInterval = 14 * 60 * 1000; // 14 minutes
setInterval(() => {
  const http = require('http');
  http.get(`http://localhost:${PORT}/health`, (res) => {
    console.log(`Health check triggered: Status ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Health check failed:', err.message);
  });
}, keepAliveInterval);

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});