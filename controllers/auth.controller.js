import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // Library for hashing passwords securely

import jwt from "jsonwebtoken"; // Library for creating authentication tokens
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

/**
 * SIGN UP - Create a new user account
 * Flow: Check email → Hash password → Save to DB → Generate token → Return response
 */

export const signUp = async (req, res, next) => {
  // Start a database session (allows us to rollback if something fails mid-process)
  const session = await mongoose.startSession();
  session.startTransaction(); // Begin the transaction

  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.status = 409;
      throw error;
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session },
    );

    // Generate a JWT token for the new user (so they stay logged in)
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // ✅ Everything worked! Commit the transaction (save changes permanently)
    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token, // Send token so user can make authenticated requests
        user: newUsers[0], // Send the new user's info (note: password is still included - see tip below)
      },
    });
  } catch (error) {
    // ❌ Something failed! Rollback the transaction (undo any partial changes)
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/**
 * SIGN IN - Authenticate an existing user
 * Flow: Find user → Check password → Generate token → Return response
 */

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User does not exist");
      error.status = 404;
      throw error;
    }

    // 🔐 Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // bcrypt.compare returns true if passwords match, false otherwise

    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {};
