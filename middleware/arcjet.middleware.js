// Import the configured Arcjet instance from our config file
// "aj" is pre-configured with rules for rate limiting, bot detection, etc.
import { aj } from "../config/arcjet.js";

/**
 * ARCJET SECURITY MIDDLEWARE
 *
 * Purpose: Protect routes from abuse using Arcjet's security rules
 *
 * How it works:
 * 1. Arcjet analyzes the incoming request (IP, headers, behavior)
 * 2. It checks against your configured rules (rate limits, bot detection, etc.)
 * 3. Returns a "decision" object telling us if the request should be allowed
 * 4. If denied, we send an appropriate error response; if allowed, we continue
 *
 * Usage in routes:
 *   app.post("/api/login", arcjetMiddleware, loginController);
 *   // Arcjet runs first → if request is safe, loginController executes
 */

const arcjetMiddleware = async (req, res, next) => {
  // 🔍 Ask Arcjet to evaluate this request
  // req: The incoming Express request (Arcjet uses IP, headers, etc.)
  // { requested: 1 }: We're requesting 1 "token" from our rate limit bucket
  //   - For rate limiting: each request costs 1 token
  //   - Arcjet tracks how many tokens are left for this user/IP
  try {
    const decision = await aj.protect(req, { requested: 1 });

    // ❌ Check if Arcjet decided to DENY this request
    // isDenied() returns true if ANY rule was triggered (rate limit, bot, etc.)
    if (decision.isDenied()) {
      // 🚦 Check if the denial was due to RATE LIMITING
      // 429 = Too Many Requests (standard HTTP status for rate limiting)
      if (decision.reason.isRateLimit())
        return res
          .status(429)
          .json({ message: "Too many requests (Rate Limit Exceeded)" });
      // 🤖 Check if the denial was due to BOT detection
      if (decision.reason.isBot())
        // 403 = Forbidden (server understood but refuses to authorize)
        return res.status(403).json({ message: "Bot Detected" });

      // 🔒 Any other denial reason (e.g., blocked IP, suspicious activity)
      // Fallback response for unspecified denial reasons
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  } catch (error) {
    // ⚠️ If Arcjet itself fails (network error, config issue, etc.)

    // Log the error server-side for debugging/monitoring
    console.log(`Arcjet Middleware Error: ${error.message}`);
    next(error);
  }
};

export default arcjetMiddleware;
