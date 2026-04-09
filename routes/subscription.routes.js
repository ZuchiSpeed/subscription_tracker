/**
 * ============================================================================
 * SUBSCRIPTION MANAGEMENT ROUTES MODULE
 * Base Path: /api/v1/subscriptions (mounted in app.js)
 * ============================================================================
 * Handles the complete lifecycle of user subscriptions:
 * - Creation, reading, updating, cancellation, and deletion
 * - Business logic endpoints like upcoming renewals
 * ============================================================================
 */

import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";

// Create a new router instance for subscription-related endpoints
const subscriptionRouter = Router();

// GET / - Fetch all subscriptions
subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "Get all subscriptions" });
});

// GET /:id - Fetch a single subscription by its ID
subscriptionRouter.get("/:id", (req, res) => {
  res.send({ title: "Get Subscription By Id" });
});

// GET /user/:id - Fetch all subscriptions belonging to a specific user
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

// POST / - Create a new subscription
subscriptionRouter.post("/", authorize, createSubscription);

// PUT /:id - Update an existing subscription by its ID
subscriptionRouter.put("/:id", (req, res) => {
  res.send({ title: "Update Subscription" });
});

// PUT /:id/cancel - Cancel a subscription by its ID (special action endpoint)
subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "Cancel Subscription" });
});

// DELETE /:id - Delete a subscription by its ID
subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete Subscription" });
});

// GET /upcoming-renewals - Fetch subscriptions that are renewing soon
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "Get upcoming renewals" });
});

export default subscriptionRouter;
