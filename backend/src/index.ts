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

app.use(cors({
  origin:"http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// middleware
app.use(express.json());
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
    client
    
  console.log(`Server is running on http://localhost:${port}`);
});