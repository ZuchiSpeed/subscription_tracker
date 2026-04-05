import User from "../models/user.model.js";

/**
 * GET ALL USERS - Fetch a list of all users
 * Route: GET /api/users
 * Access: Public (⚠️ Consider adding auth middleware for production)
 */

export const getUsers = async (req, res, next) => {
  try {
    // Find all users in the database
    // .find() with no arguments returns all documents
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    // If any error occurs, pass it to the global error handler middleware
    next(error);
  }
};

/**
 * GET SINGLE USER - Fetch one user by their ID
 * Route: GET /api/users/:id
 * Access: Public (⚠️ Consider adding auth middleware for production)
 */

export const getUser = async (req, res, next) => {
  try {
    // Find user by ID from the URL parameters (req.params.id)
    // .select("-password") excludes the password field from the result
    // The "-" means "exclude this field"
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not Found!!");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
