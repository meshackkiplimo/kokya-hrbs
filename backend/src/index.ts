import dotenv from 'dotenv';
import express from 'express';
import db, { client } from './Drizzle/db';
import { hotelRoute } from './routes/hotelRoute';
import { roomRoute } from './routes/roomRoute';
import { paymentRoute } from './routes/paymentRoute';
import { complainRoute } from './routes/complainRoute';



dotenv.config();

const app = express();


// middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
const  port = process.env.PORT


hotelRoute(app);
roomRoute(app);
paymentRoute(app);
complainRoute(app);





app.listen(port, () => {
    client
    
  console.log(`Server is running on http://localhost:${port}`);
});