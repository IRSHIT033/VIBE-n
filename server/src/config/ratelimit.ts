import rateLimit from "express-rate-limit";
import { Express } from "express";

const rateLimitConfig=(app:Express)=>{
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
  });
  // Apply rate limiter to all requests
  app.use(limiter);
} 

export default rateLimitConfig
