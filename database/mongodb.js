import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

// Ensure that environment variable is defined before connecting to the database
if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variables inside .env<development/production>.local file",
  );
}

// Function to connect mongodb to mongoose
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(
      `Connected to MongoDB successfully in ${NODE_ENV} environment!`,
    );
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

export default connectToDatabase;
