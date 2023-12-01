import express, { Express } from "express";
import appController from "../Controller/app.controller";

const appProtectRoute: Express = express();

appProtectRoute.post("/logout", appController.logout);

export default appProtectRoute;
