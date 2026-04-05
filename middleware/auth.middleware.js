import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

/**
 * AUTHORIZE MIDDLEWARE - Verify JWT token and attach user to request
 *
 * How it works:
 * 1. Client sends request with header: "Authorization: Bearer <token>"
 * 2. This middleware extracts and verifies the token
 * 3. If valid, it finds the user and attaches them to req.user
 * 4. The next controller can then use req.user to know who is logged in
 *
 * Usage in routes:
 *   app.get("/profile", authorize, (req, res) => {
 *     // req.user is available here because authorize ran first
 *     res.json({ user: req.user });
 *   });
 */

const authorize = async (req, res, next) => {
  try {
    let token; // Variable to store the JWT token

    // Check if the Authorization header exists and starts with "Bearer"
    // Example header: "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Split the header by space and take the second part (the actual token)
      // ["Bearer", "eyJhbGciOiJIUzI1NiIs..."] → take index [1]

      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token using the secret key
    // If token is invalid or expired, jwt.verify() throws an error → caught below
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Token is valid and user exists!
    // Attach the user object to the request so controllers can access it

    req.user = user; // Attach user info to request object for use in controllers
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
