import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: { code: "RATE_LIMIT", message: "Too many requests" } },
});

export default limiter;
