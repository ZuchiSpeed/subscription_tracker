import mongoose from "mongoose";

/**
 * Subscription Schema
 *
 * Represents a recurring subscription owned by a User.
 *
 * RELATIONSHIP: Many-to-One with User
 * - Many Subscriptions belong to ONE User
 * - The `user` field stores the ObjectId reference to the User document
 *
 * Data Flow:
 *   User (1) ──< (N) Subscription
 *
 * Query Examples:
 *   // Get subscription + its user
 *   const sub = await Subscription.findById(id).populate('user');
 *
 *   // Get all subscriptions for a user
 *   const subs = await Subscription.find({ user: userId });
 *
 *   // Get user + all their subscriptions (using virtual)
 *   const user = await User.findById(userId).populate('subscriptions');
 */

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "subscription Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },

    /**
     * Price amount for the subscription
     * - min: Prevents negative prices at schema level
     * - Consider adding currency formatting at the API/response layer, not in schema
     */

    price: {
      type: Number,
      required: [true, "Subscription Price is required"],
      min: [0, "Price must be greater than 0"],
    },

    /**
     * Currency code (ISO 4217 format)
     * - enum: Restricts values to predefined list → prevents invalid currencies
     * - default: Falls back to "NAD" if not specified
     */

    currency: {
      type: String,
      enum: [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "SEK",
        "NZD",
        "NAD",
      ],
      default: "NAD",
    },

    /**
     * Billing frequency for the subscription
     * - Used by middleware to auto-calculate renewalDate
     * - enum ensures only valid intervals are accepted
     */

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },

    /**
     * Category for grouping/filtering subscriptions
     * - Helps with analytics, UI grouping, or reporting
     */

    category: {
      type: String,
      enum: ["entertainment", "utilities", "education", "health", "other"],
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },

    /**
     * Date when the subscription started
     * - required: Must be provided
     * - validate: Custom logic ensures start date isn't in the future
     *
     * ⚠️ Arrow function used here because validator ONLY uses `value` (no `this` needed)
     * Arrow functions preserve lexical scope and are safe when `this` isn't required.
     */

    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value < new Date(),
        message: "Start date must be in the past",
      },
    },

    /**
     * Date when the subscription renews (or expired)
     * - Optional on input: Auto-calculated by pre-save middleware if missing
     * - validate: Cross-field validation using `this.startDate`
     */

    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },

    /**
     * 🔗 RELATIONSHIP: Reference to the User who owns this subscription
     *
     * - type: ObjectId → Stores the _id of a User document
     * - ref: "User" → Tells Mongoose which model to populate from
     * - required: Every subscription MUST belong to a user
     * - index: true → Creates a database index for faster queries like:
     *     Subscription.find({ user: userId })
     *
     * This is the "foreign key" that creates the Many-to-One relationship.
     *
     * Usage with populate():
     *   const sub = await Subscription.findById(id).populate('user');
     *   console.log(sub.user.name); // Access user data directly
     */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    /**
     * Schema Options
     * - timestamps: Adds createdAt/updatedAt automatically
     */
    timestamps: true,
  },
);

/**
 * 🔁 PRE-SAVE MIDDLEWARE
 *
 * Runs automatically BEFORE a Subscription document is saved to the database.
 * Use cases:
 *   - Auto-calculate derived fields (like renewalDate)
 *   - Auto-update status based on business logic
 *   - Hash passwords, normalize data, etc.
 *
 * Execution Order:
 *   1. Document validation runs first
 *   2. If validation passes, pre-save hooks execute in order
 *   3. If any hook calls next(err), save is aborted
 *   4. If all hooks call next(), document is saved
 */

// Auto-calculate renewal date if missing
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    // Clone startDate to avoid mutating the original
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency],
    );
  }

  //Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

//Mongoose model based on the suscriptionSchema
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
