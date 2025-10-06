const express = require('express');
const userRoutes = require('./routes/user.routes');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);

module.exports = app;
