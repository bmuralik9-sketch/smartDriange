const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const defaultData = require("./defaultData");

let isUsingMockDb = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smart_drainage";
  
  // If explicitly requested or no local mongo daemon
  if (process.env.USE_MOCK_DB === "true") {
    console.log("ℹ️ [DB] USE_MOCK_DB set to true. Initializing in-memory persistence layer...");
    isUsingMockDb = true;
    return false;
  }

  try {
    // Set a short timeout so the server starts immediately without freezing for 30s
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });
    console.log(`✅ [DB] Connected to MongoDB: ${mongoose.connection.host}`);
    isUsingMockDb = false;
    return true;
  } catch (err) {
    console.warn(`⚠️ [DB] MongoDB unavailable (${err.message}). Switching to Embedded Resilient Mock/JSON Store.`);
    isUsingMockDb = true;
    return false;
  }
};

const getIsUsingMock = () => isUsingMockDb;

module.exports = {
  connectDB,
  getIsUsingMock
};
