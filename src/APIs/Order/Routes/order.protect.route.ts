import express, { Express } from "express";
import orderController from "../Controller/order.controller";

const orderProtectRoute: Express = express();

orderProtectRoute.post("/insert", orderController.insert);
orderProtectRoute.put("/update", orderController.update);
orderProtectRoute.delete("/delete/:_id", orderController.delete);

export default orderProtectRoute;
