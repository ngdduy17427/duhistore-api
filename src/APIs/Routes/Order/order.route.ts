import express, { Express } from "express";
import orderController from "../../Controllers/Order/order.controller";

const router: Express = express();

router.get("/findAll", orderController.findAll);
router.get("/findById/:id", orderController.findById);

export { router };
