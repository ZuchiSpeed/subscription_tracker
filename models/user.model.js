import mongoose from "mongoose";

/**
 * User Schema
 *
 * Represents a registered user in the system.
 *
 * RELATIONSHIP: One-to-Many with Subscription
 * - One User can have MANY Subscriptions (1:N)
 * - The "user" field in Subscription schema references this model via ObjectId
 *
 * Example Query to get all subscriptions for a user:
 *   const user = await User.findById(userId).populate('subscriptions');
 *
 * Or query from Subscription side:
 *   const subs = await Subscription.find({ user: userId });
 */

const userSchema = new mongoose.Schema(
  {
    /**
     * User's display name
     * - required: Must be provided, with custom error message
     * - trim: Removes whitespace from start/end before saving
     * - minLength/maxLength: Ensures name is realistic (2-50 chars)
     */
    name: {
      type: String,
      required: [true, "UserName is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },

    /**
     * User's email address (used for authentication)
     * - unique: Creates a unique index → prevents duplicate emails at DB level
     * - lowercase: Automatically converts input to lowercase before saving
     * - match: Regex validation ensures basic email format
     *
     * ⚠️ Note: Unique indexes only work on save(), not on update() operations
     */

    email: {
      type: String,
      required: [true, "User Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: [6, "Password must be 6 characters long"],
    },

    /**
     * 🔗 RELATIONSHIP FIELD (Virtual - defined below)
     *
     * This creates a virtual property "subscriptions" on User documents
     * that automatically fetches all Subscription docs where user = this User's _id
     *
     * Usage:
     *   const user = await User.findById(id).populate('subscriptions');
     *   console.log(user.subscriptions); // Array of Subscription docs
     */
  },
  {
    /**
     * Schema Options
     * - timestamps: true → Automatically adds `createdAt` and `updatedAt` fields
     *   - createdAt: Set once on document creation
     *   - updatedAt: Updated on every save()
     *
     */
    timestamps: true,
  },
);

//Mongoose model based on the userSchema
const User = mongoose.model("User", userSchema);

export default User;
