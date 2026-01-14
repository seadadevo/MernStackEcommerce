import express from "express"
import 'dotenv/config' 
import cors from 'cors'
import connectDB from "./config/db.js";
import userRoute from './routes/userRoute.js'  
import productRoute from './routes/productRoute.js'  

const app = express();
const PORT =  process.env.PORT || 3000;


connectDB()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});