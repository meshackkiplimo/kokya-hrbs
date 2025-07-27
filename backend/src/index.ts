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


 


app.get('/', (req, res) => {
  res.send('Hello World!');
});
const  port = process.env.PORT

hotelRoute(app);
roomRoute(app);
paymentRoute(app);
complainRoute(app);
bookingRoute(app);
authRoute(app);
mpesaRoute(app);
paystackRoute(app);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});