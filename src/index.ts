import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import RateLimit from "express-rate-limit";
import { initAPIs } from "./APIs/APIs";
import { config } from "./Config/config";

/**
 * Middleware
 * Flow: config response > bodyParser
 */
const APP: Express = express();

// Running behind a proxy
APP.enable("trust proxy");

// Create response header
APP.use((_: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-type", "application/json");

  next();
});

// Use .env
dotenv.config();

// Enable CORS
APP.use(cors());
// Parse request of content-type application/json
APP.use(express.json());
// Parse request of content-type application/x-www-form-urlencoded
APP.use(express.urlencoded({ extended: true }));
// Apply rate limiter to all requests
APP.use(RateLimit(config.rateLimitConfig));

// Init router
initAPIs(APP);

// Create server
APP.listen(config.serverConfig.SERVER_PORT, () => {
  console.log("Server is running on %s", config.serverConfig.SERVER_PORT);
});
/**
 * End Middleware
 */

module.exports = APP;
