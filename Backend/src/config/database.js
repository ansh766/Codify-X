const mongoose = require("mongoose");

async function main () {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
}

module.exports = main;
