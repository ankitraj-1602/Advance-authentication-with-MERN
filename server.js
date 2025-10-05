const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/db');
const authRouter = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const managerRouter = require('./routes/managerRoutes')
const roleRouter = require('./routes/roleRoutes')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

dotenv.config()
dbConnect()

const app = express();

app.use(helmet())

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/manager', managerRouter);
app.use('/api/roles',roleRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
})