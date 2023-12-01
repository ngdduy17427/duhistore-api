import express, { Express } from "express";
import purchaseController from "../Controller/purchase.controller";

const purchaseProtectRoute: Express = express();

purchaseProtectRoute.post("/insert", purchaseController.insert);
purchaseProtectRoute.put("/update", purchaseController.update);
purchaseProtectRoute.delete("/delete/:_id", purchaseController.delete);

export default purchaseProtectRoute;
