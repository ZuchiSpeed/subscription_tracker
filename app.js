/**
 * ============================================================================
 * SUBSCRIPTION TRACKER API - MAIN APPLICATION FILE
 * ============================================================================
 * This file serves as the entry point for the Express.js application.
 * It initializes the server, loads configuration, and registers all API routes.
 * ============================================================================
 */

// Import the Express framework to create a web server
import express from "express";

// Import the PORT number from our environment config file
import { PORT } from "./config/env.js";

import authRouter from "./routes/auth.routes.js"; // Handles login/signup routes
import userRouter from "./routes/user.routes.js"; // Handles user management routes
import subscriptionRouter from "./routes/subscription.routes.js"; // Handles subscription routes
import connectToDatabase from "./database/mongodb.js"; // Function to connect to MongoDB database
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";

// Create a new Express application instance
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Apply Arcjet middleware globally to all routes for bot protection and rate limiting
app.use(arcjetMiddleware);

// Mount the auth router: all requests to /api/v1/auth/* go to authRouter
app.use("/api/v1/auth", authRouter);

// Mount the user router: all requests to /api/v1/users/* go to userRouter
app.use("/api/v1/users", userRouter);

// Mount the subscription router: all requests to /api/v1/subscriptions/* go to subscriptionRouter
app.use("/api/v1/subscriptions", subscriptionRouter);

// Global error handling middleware
app.use(errorMiddleware);

// Define a GET route for the root URL "/"
app.get("/", (req, res) => {
  res.send("Wugwaan");
});

// Start the server and listen on the specified PORT
app.listen(PORT, async () => {
  console.log(`Server is running on https://localhost:${PORT}`);

  // Connect to the MongoDB database when the server is running
  await connectToDatabase();
});

export default app;
