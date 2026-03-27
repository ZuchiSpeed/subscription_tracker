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

// Create a new router instance for user-related endpoints
const userRouter = Router();

// GET / - Fetch all users
userRouter.get("/", (req, res) => {
  res.send({ title: "Get all users" });
});

// GET /:id - Fetch a single user by their ID (:id is a dynamic path parameter)
userRouter.get("/:id", (req, res) => {
  res.send({ title: "Get User By Id" });
});

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
