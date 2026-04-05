/**
 * ============================================================================
 * USER MANAGEMENT ROUTES MODULE
 * Base Path: /api/v1/users (mounted in app.js)
 * ============================================================================
 * Implements full CRUD (Create, Read, Update, Delete) operations for users.
 * Follows RESTful API conventions for resource management.
 * ============================================================================
 */

// Import the Router class from Express
import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

// Create a new router instance for user-related endpoints
const userRouter = Router();

// GET / - Fetch all users
userRouter.get("/", getUsers);

// GET /:id - Fetch a single user by their ID (:id is a dynamic path parameter)
// This route is protected by the 'authorize' middleware, which checks for a valid JWT token before allowing access
userRouter.get("/:id", authorize, getUser);

// POST / - Create a new user
userRouter.post("/", (req, res) => {
  res.send({ title: "Create New User" });
});

// PUT /:id - Update an existing user by their ID
userRouter.put("/:id", (req, res) => {
  res.send({ title: "Update User Profile" });
});

// DELETE /:id - Delete a user by their ID
userRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete User" });
});

export default userRouter;
