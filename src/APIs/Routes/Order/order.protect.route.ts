import express, { Express } from "express";
import orderController from "../../Controllers/Order/order.controller";

const router: Express = express();

router.post("/insert", orderController.insert);
router.put("/update", orderController.update);
router.delete("/delete/:id", orderController.delete);

export { router };
