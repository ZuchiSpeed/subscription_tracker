/**
 * ============================================================================
 * AUTHENTICATION ROUTES MODULE
 * Base Path: /api/v1/auth (mounted in app.js)
 * ============================================================================
 * Handles user authentication operations: sign up, sign in, sign out.
 * Currently returns placeholder responses - real implementation would include:
 * - Input validation
 * - Password hashing
 * - JWT token generation
 * - Database operations
 * ============================================================================
 */

// Import the Router class from Express to create modular route handlers
import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

// Create a new router instance for authentication-related endpoints
const authRouter = Router();

// Define a POST route for /sign-up (user registration)
authRouter.post("/sign-up", signUp);

// Define a POST route for /sign-In (user login)
authRouter.post("/sign-In", signIn);

// Define a POST route for /sign-out (user logout)
authRouter.post("/sign-out", signOut);

export default authRouter;
