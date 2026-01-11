import express from "express"
import 'dotenv/config' 
import cors from 'cors'
import connectDB from "./config/db.js";
import userRoute from './routes/userRoute.js'  

const app = express();
const PORT =  process.env.PORT || 3000;


connectDB()

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/api/v1/user', userRoute)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});