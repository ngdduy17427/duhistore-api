import express, { Express } from "express";
import appInitController from "../../Controllers/AppInit/app.init.controller";

const router: Express = express();

router.post("/logout", appInitController.logout);

export { router };
