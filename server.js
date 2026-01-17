const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express & Connect DB
const app = express();
connectDB();

// 3. Middlewares
// We configure CORS to only trust your frontend URL
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your actual frontend URL later
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json()); // Parses incoming JSON

// 4. Routes
// These point to the route files we created in previous steps
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Health Check Route
app.get('/', (req, res) => {
  res.send('PlacementFlow API is running... 🚀');
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});