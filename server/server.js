import express from "express"
import 'dotenv/config' 
import connectDB from "./config/db.js";
const app = express();
const PORT =  process.env.PORT || 3000;

connectDB()

app.listen(PORT, () => {
    console.log(`Server is runing at port ${PORT}`)
})
