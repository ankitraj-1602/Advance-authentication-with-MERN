const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/db');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser')

dotenv.config()
dbConnect()

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRouter);

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`)
})