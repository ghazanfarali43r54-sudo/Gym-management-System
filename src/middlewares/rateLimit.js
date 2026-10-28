const rateLimit = require("express-rate-limit");

// Ek IP se registration request: 1 ghante me 10 tak
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

// Status check (navbar ye bar bar poochta hai): 1 minute me 60 tak
exports.statusLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please slow down." },
});

// Login par galat password ki bar bar koshish rokne ke liye: 15 minute me 20 tak
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again in a few minutes." },
});