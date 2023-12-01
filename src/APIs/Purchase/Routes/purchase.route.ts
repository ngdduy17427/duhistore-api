import express, { Express } from "express";
import purchaseController from "../Controller/purchase.controller";

const purchaseRoute: Express = express();

purchaseRoute.get("/findAll", purchaseController.findAll);
purchaseRoute.get("/findById/:_id", purchaseController.findById);
purchaseRoute.get("/summary", purchaseController.summary);

export default purchaseRoute;
