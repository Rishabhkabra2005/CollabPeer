const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error(
      "ERROR: MONGODB_URI is not set. Add it to server/.env (see README)."
    );
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
  