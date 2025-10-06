const express = require('express');
const userRoutes = require('./routes/user.routes');
const locationRoutes = require('./routes/location.routes');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);

module.exports = app;