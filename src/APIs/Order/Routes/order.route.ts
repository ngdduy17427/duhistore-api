import express, { Express } from "express";
import orderController from "../Controller/order.controller";

const orderRoute: Express = express();

orderRoute.get("/findAll", orderController.findAll);
orderRoute.get("/findById/:_id", orderController.findById);
orderRoute.get("/summary", orderController.summary);

export default orderRoute;
