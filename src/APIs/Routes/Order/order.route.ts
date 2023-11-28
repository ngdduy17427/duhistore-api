import express, { Express } from "express";
import orderController from "../../Controllers/Order/order.controller";

const router: Express = express();

router.get("/findAll", orderController.findAll);
router.get("/findById/:_id", orderController.findById);
router.get("/summary", orderController.summary);

export { router };
