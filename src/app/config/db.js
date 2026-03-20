const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URL);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Mongoose connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
