import dotenv from 'dotenv';
import express from 'express';
import db, { client } from './Drizzle/db';
import { hotelRoute } from './routes/hotelRoute';
import { roomRoute } from './routes/roomRoute';



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





app.listen(port, () => {
    client
    
  console.log(`Server is running on http://localhost:${port}`);
});