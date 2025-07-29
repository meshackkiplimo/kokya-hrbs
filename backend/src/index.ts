import dotenv from 'dotenv';
import express from 'express';
import db, { client } from './Drizzle/db';
import { hotelRoute } from './routes/hotelRoute';
import { roomRoute } from './routes/roomRoute';
import { paymentRoute } from './routes/paymentRoute';
import { complainRoute } from './routes/complainRoute';
import { bookingRoute } from './routes/bookingRoute';
import { authRoute } from './routes/authRoute';

import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';
import { mpesaRoute } from './routes/mpesaRoute';
import { paystackRoute } from './routes/paystackRoute';

dotenv.config();


export const app = express();
const  allowedOrigins = [
  'http://localhost:5173',
  'https://kokya-hrbs.vercel.app',
]

// Custom CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow M-Pesa callback URLs (Safaricom servers don't send origin header)
  if (req.path.includes('/api/v1/mpesa/callback') || req.path.includes('/api/v1/paystack/webhook')) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// middleware
app.use(express.json());

// Add request logging middleware for M-Pesa and Paystack endpoints
app.use('/api/v1/mpesa', (req, res, next) => {
  console.log(`=== M-PESA REQUEST LOG ===`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  console.log(`Body:`, req.body);
  console.log(`IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`========================`);
  next();
});

// cors for all origins

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("cloudinary config", cloudinary.config());


 


// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Kokya HRBS API Server is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Environment variable validation
const requiredEnvVars = ['DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const port = parseInt(process.env.PORT || '3000', 10);

hotelRoute(app);
roomRoute(app);
paymentRoute(app);
complainRoute(app);
bookingRoute(app);
authRoute(app);
mpesaRoute(app);
paystackRoute(app);

// Start the server (database connection is handled in db.ts)
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: ${process.env.NODE_ENV === 'production' ? 'https://tripnest-hsux.onrender.com' : `http://localhost:${port}`}`);
  console.log(`⚡ Kokya HRBS API Server started successfully!`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n📤 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('🔒 HTTP server closed.');
    
    // Close database connection
    client.end().then(() => {
      console.log('🗄️ Database connection closed.');
      console.log('✅ Graceful shutdown completed.');
      process.exit(0);
    }).catch((err) => {
      console.error('❌ Error closing database connection:', err);
      process.exit(1);
    });
  });
};

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});