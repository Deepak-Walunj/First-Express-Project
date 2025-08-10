const express = require('express');
const authRoutes = require('../routes/authRoutes');

module.exports = function(app){
    app.use(express.json())
    app.use('/api/auth', authRoutes);
}
