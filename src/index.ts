import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import RateLimit from "express-rate-limit";
import { initAPIs } from "./APIs/APIs";
import { config } from "./Config/config";
import mongoDB from "./Database";

/**
 * Middleware
 * Flow: config response > bodyParser
 */
const APP: Express = express();

mongoDB.connectToMongoDB().then(() => {
  // Use .env
  dotenv.config();

  // Create response header
  APP.use((_: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-type", "application/json");

    next();
  });

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
    console.log("> Duhi Store API is running on port: %s", config.serverConfig.SERVER_PORT);
  });
});
/**
 * End Middleware
 */

module.exports = APP;
