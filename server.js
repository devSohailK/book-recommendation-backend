import express from 'express';
import dotenv from 'dotenv';
import pool from './database.js'; 
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';


dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);

app.use('/api/user',  userRoutes);



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})