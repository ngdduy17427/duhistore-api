import express, { Express } from "express";
import appInitController from "../../Controllers/AppInit/app.init.controller";

const router: Express = express();

router.get("/init", appInitController.init);
router.post("/login", appInitController.login);

export { router };
