import express, { Express } from "express";
import appController from "../Controller/app.controller";

const appRoute: Express = express();

appRoute.get("/", appController.welcome);
appRoute.get("/init", appController.init);
appRoute.post("/login", appController.login);
appRoute.post("/loginWithPinCode", appController.loginWithPinCode);

export default appRoute;
