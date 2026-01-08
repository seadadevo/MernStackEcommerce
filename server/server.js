import express from "express"
import 'dotenv/config' 
import connectDB from "./config/db.js";
import userRoute from './routes/userRoute.js'  

const app = express();
const PORT =  process.env.PORT || 3000;


connectDB()

app.use(express.json());

app.use('/api/v1/user', userRoute)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});