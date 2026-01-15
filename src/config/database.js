const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {});
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`MongoDB connection failed: ${error.message}`);
        console.warn('Running in memory-only mode (data will not persist).');
        isConnected = false;
    }
};

const isDBConnected = () => isConnected;

module.exports = { connectDB, isDBConnected };
