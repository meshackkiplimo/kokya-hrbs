import dotenv from 'dotenv';
import express from 'express';
import db, { client } from './Drizzle/db';



dotenv.config();

const app = express();


// middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
const  port = process.env.PORT





app.listen(port, () => {
    client
    
  console.log(`Server is running on http://localhost:${port}`);
});