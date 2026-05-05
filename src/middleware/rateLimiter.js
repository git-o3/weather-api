import rateLimit from "express-rate-limit";

export const weatherRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000 ,  // 15 mintutes
    max: 100,                   // limit per IP - 100 req per window
    standardHeaders: true,       // return rate limit info in the "RateLimit-*" headers
    legacyHeaders: false,        // disable the "X-RateLimit-*" headers
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
});